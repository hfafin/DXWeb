import resumeContext from './resumeContext.js';

let resumed = false;
var ctx = new AudioContext();

window.onload = function()
{
	var ratio = document.getElementById("ratio");
	var mod = document.getElementById("mod");
	var attack = document.getElementById("attack");
	var decay = document.getElementById("decay");
	var modAttack = document.getElementById("modAttack");
	var modDecay = document.getElementById("modDecay");
}

async function init(ctx)
{
		if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess().then(onMIDIInit, onMIDIReject);
    } 
    else {
        console.log("No MIDI support present in your browser.    You're gonna have a bad time.");
    }
		await resumeContext(ctx);			
}

function playNote(noteNumber, velocity)
{
	var out = ctx.destination;
	var now = ctx.currentTime;	

	var OscA = ctx.createOscillator();
	var OscB = ctx.createOscillator();		

	var envA = ctx.createGain();
	var envB = ctx.createGain();

	let r = parseFloat(ratio.value);
	let modAmount = parseFloat(mod.value);
	let a = parseFloat(attack.value);
	let d = parseFloat(decay.value);
	let ModA = parseFloat(modAttack.value);
	let ModD = parseFloat(modDecay.value);


	OscA.frequency.value = 440*Math.pow(2,(noteNumber-69)/12);
	OscB.frequency.value = r*440*Math.pow(2,(noteNumber-69)/12);

	envA.gain.value = 0;
	envB.gain.value = 100;

	OscA.start();
	OscB.start();

	OscB.connect(envB);
	envB.connect(OscA.detune);
	OscA.connect(envA);
	envA.connect(out);

	envA.gain.cancelScheduledValues(now);
	envA.gain.linearRampToValueAtTime(0.5, now + a);
	envA.gain.setValueAtTime(0.5, now + a);
	envA.gain.exponentialRampToValueAtTime(0.0001, now + d);	

	envB.gain.cancelScheduledValues(now);
	envB.gain.linearRampToValueAtTime(modAmount , now + ModA);
	envB.gain.setValueAtTime(modAmount , now + ModA);
	envB.gain.exponentialRampToValueAtTime(0.0001, now + ModD);	

}


window.addEventListener('load', init(ctx) );

function onMIDIInit (midi) {
    console.log('MIDI ready!');

    let haveAtLeastOneDevice = false;
    let inputs = midi.inputs.values();

    for (let input of inputs) {
        console.log(input); 
        input.onmidimessage = midiMessageEventHandler;
        haveAtLeastOneDevice = true;
    }
    if (!haveAtLeastOneDevice) { console.log("No MIDI input devices present. You're gonna have a bad time."); }
}

function onMIDIReject (err) {
    console.log(`The MIDI system failed to start.    You're gonna have a bad time. ${err}`);
}

function midiMessageEventHandler (event) {
    // [Status (message type + channel), Data 1 (note), Data 2 (velocity)]
    let str = 'MIDI message received [' + event.data.length + ' bytes]: ';
    for (let i = 0; i < event.data.length; i++) {
        str += event.data[i] + ' ';
    }
    console.log(str);

    // Mask off the lower nibble (MIDI channel, which we don't care about)
    console.log("event.data[0] & 0xf0", event.data[0] & 0xf0)
    switch (event.data[0] & 240) {
        case 144:
            if (event.data[2] > 0) { // if velocity > 0, this is a note-on message
                noteOn(event.data[1], event.data[2], ctx);
            }
            break;
        // note off if necessary
        // case 128:
        //     noteOff(event.data[1]);
        //     break;
        case 176:
            continuousController(event.data[1], event.data[2]);
            break;
    }
}

function continuousController (ctrlNumber, value) {
    console.log("ctrlNumber", ctrlNumber)
    if (ctrlNumber === 75) {
        filter.frequency.value = ((Math.exp(value / 127) - 1)) * freqMax;
        filterDefault = filter.frequency.value;
    }
}

function noteOn (noteNumber, velocity) {
    console.log('note on', noteNumber, velocity);
    playNote(noteNumber, velocity, ctx);
}

function noteOff (noteNumber) {
    console.log('note off', noteNumber);
}
