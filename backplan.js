import * as parser from './modules/parser.js';

let DATE_PICKER = null;
let RECIPE_INPUT = null;
let PLAN_OUTPUT = null;

function render_schedule( a_plan, a_target_date ) {
    let current_target = new Date( a_target_date + a_plan.max_minutes*60000 );
    DATE_PICKER.value = current_target.toISOString().slice(0,16);

    let times = [];
    let target = null;
    times.push( '* ' + current_target.toISOString().slice(0,16)  );
    for( var step of a_plan.steps.reverse() ) {
        target = new Date( current_target - step.max_minutes*60000 );
        times.push( '| ' + step.input );
        times.push( '* ' + target.toISOString().slice(0,16)  );
        current_target = target;
    }
    PLAN_OUTPUT.value = times.reverse().join('\n');
}

function update_plan() {
    const plan = parser.parse_data(RECIPE_INPUT.value);
    return render_schedule( plan, new Date(DATE_PICKER.value) );
}

function init( a_options ) {
    DATE_PICKER = document.getElementById(a_options.time_input);
    DATE_PICKER.addEventListener('change', event => update_plan() );
    /* assume target date is in 24h */
    DATE_PICKER.value = new Date( Date.now() + 24*60*60*1000 ).toISOString().slice(0,16);

    RECIPE_INPUT = document.getElementById(a_options.recipe_input);
    RECIPE_INPUT.addEventListener('change', (event) => update_plan() );

    PLAN_OUTPUT =  document.getElementById(a_options.plan_output);

    update_plan();
}

export { init };