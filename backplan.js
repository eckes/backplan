import * as parser from './modules/parser.js';

let DATE_PICKER = null;
let RECIPE_INPUT = null;
let PLAN_OUTPUT = null;

function update_plan() {
    const plan = parser.parse_data(RECIPE_INPUT.value);
    let current_target = new Date( Date.now() + plan.max_minutes*60000 );
    DATE_PICKER.value = current_target.toISOString().slice(0,16);
    console.log(plan);

    let times = [];
    let target = null;
    for( var step of plan.steps.reverse() ) {
        target = new Date( current_target - step.max_minutes*60000 );
        times.push( target.toISOString().slice(0,16) + ' ' + step.description );
        current_target = target;
    }
    PLAN_OUTPUT.value = times.reverse().join('\n');
}

function init( a_options ) {
    DATE_PICKER = document.getElementById(a_options.time_input);
    RECIPE_INPUT = document.getElementById(a_options.recipe_input);
    PLAN_OUTPUT =  document.getElementById(a_options.plan_output);
    update_plan();
}

export { init };