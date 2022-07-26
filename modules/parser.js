function timeConvert(a_minutes) {
const hours = (a_minutes / 60);
const rhours = Math.floor(hours);
const minutes = (hours - rhours) * 60;
const rminutes = Math.round(minutes);
return [ rhours, rminutes ];
}

function to_minutes( a_time ) {
    const t = a_time.match(/^([0-9]*)(:*)([0-9]+)$/);
    if(!t) {
        return 0;
    }
    if(t[2] == ':') {
        if( !t[1] ) {
            t[1] = '0';
        }
        return parseInt(t[1])*60+parseInt(t[3]);
    }
    return parseInt(t[0])*60;
}

function parse_times(a_data) {
    const minmax = a_data.match(/^([0-9:]*)(\.*)([0-9:]*)$/);
    if(!minmax) {
        return(null);
    }
    const min_minutes = to_minutes(minmax[1]);
    let max_minutes = to_minutes(minmax[3]);
    if( max_minutes == 0 ) {
        max_minutes = min_minutes;
    }
    return( {min_minutes: min_minutes, max_minutes: max_minutes} );
}

function parse_line(a_line) {
    // { min_minutes: 20*60, max_minutes: 22*60, description: blabla }
    const found = a_line.match(/^([0-9.:]+) (.*)$/);
    if(!found) {
        return null;
    }
    // found[1]:
    // 20..22 -> .. separator
    // :30    -> 30 minutes
    // :45..1 -> 45 to 60 minutes
    const timing = parse_times(found[1]);
    if(!timing) {
        return null;
    }
    return {
        input: a_line,
        min_minutes: timing.min_minutes,
        max_minutes: timing.max_minutes,
        description: found[2]
    };
}

function parse_end_time(a_line) {

}

function parse_data( a_data ) {
    const data = a_data.trim().split('\n')
    let plan = {
        steps: [],
        min_minutes: 0,
        max_minutes: 0,
    };
    for (var line of data) {
        const l = parse_line(line.trim())
        if (l) {
            plan.steps.push(l);
        }
    }

    plan.steps.forEach( s => { 
        plan.min_minutes += s.min_minutes;
        plan.max_minutes += s.max_minutes
    });

    let converted = timeConvert(plan.min_minutes);
    console.log( 'min duration: ' + converted[0] + ':' + converted[1] );
    converted = timeConvert(plan.max_minutes);
    console.log( 'max duration: ' + converted[0] + ':' + converted[1] );

    return plan;
}

export { parse_data };