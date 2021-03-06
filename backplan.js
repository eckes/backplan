import * as parser from './modules/parser.js';

let DATE_PICKER = null;
let RECIPE_INPUT = null;
let PLAN_OUTPUT = null;

const zeroPad = (num, places=2) => {
  const numZeroes = places - num.toString().length + 1;
  if (numZeroes > 0) {
    return Array(+numZeroes).join("0") + num;
  }
  return num
}

function add_minutes( a_start, a_minutes ) {
    return new Date( a_start.getTime() + a_minutes * 60 * 1000 )
}

function sub_minutes( a_start, a_minutes ) {
    return new Date( a_start.getTime() - a_minutes * 60 * 1000 )
}

function time_to_short_string( a_time ) {
    return a_time.toISOString().slice(0,16);
}

function time_to_local_string( a_time ) {
    return   zeroPad(a_time.getDate()) + '.'
           + zeroPad(a_time.getMonth() + 1) + '.'
           + zeroPad(a_time.getFullYear()) + ' '
           + zeroPad(a_time.getHours()) + ':'
           + zeroPad(a_time.getMinutes());
}

function render_schedule( a_plan, a_target_date, a_output ) {
//  let current_target = add_minutes( a_target_date, a_plan.max_minutes);
    let current_target = a_target_date;
    let times = [];
    let target = null;
    times.push( '* ' + time_to_local_string(current_target) );
    for( var step of a_plan.steps.reverse() ) {
        target = sub_minutes( current_target, step.max_minutes);
        times.push( '|   ' + step.input );
        times.push( '* ' + time_to_local_string(target) );
        current_target = target;
    }
    a_output.value = times.reverse().join('\n');
}

function update_plan() {
    return render_schedule( parser.parse_data(RECIPE_INPUT.value),
                            new Date(DATE_PICKER.value),
                            PLAN_OUTPUT );
}

function clear_input() {
    RECIPE_INPUT.value="";
    PLAN_OUTPUT.value="";
}

function init( a_options ) {
    DATE_PICKER = document.getElementById(a_options.time_input);
    DATE_PICKER.addEventListener('change', event => update_plan() );
    /* assume target date is in 24h */
    const now = new Date();

    const o = now.getTimezoneOffset();
    
    const target = new Date( Date.now() + 24*60*60*1000 - o*60*1000);
    DATE_PICKER.value = time_to_short_string(target);

    RECIPE_INPUT = document.getElementById(a_options.recipe_input);
    RECIPE_INPUT.addEventListener('change', (event) => update_plan() );
    RECIPE_INPUT.value = `# Comment lines start with a hash character (#)

# Plain numbers (without colons) are handled as hours
# Durations are given with ..
# This step takes 20 to 22 hours
20..22 vt, st, bs

# Everything with colons is treated as HOURS:MINUTES
# HOURS are optional
# This step takes 15 minutes
:15 mischen
:60 stg
# As mentioned above: this step takes 1 hour and 10 minutes
1:10 ruhe
:10 formen
1 ruhe
1 backen 250..220`;

    PLAN_OUTPUT =  document.getElementById(a_options.plan_output);

    document.getElementById(a_options.clear_button).addEventListener("click", clear_input);

    update_plan();
}

export { init };