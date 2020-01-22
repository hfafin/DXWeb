import resumeContext from './resumeContext.js';
const $btn = document.querySelector('button');


async function init()
{
	let ratio = 1;

	var ctx = new AudioContext();
	var out = ctx.destination;
	var envA = ctx.createGain();
	var envB = ctx.createGain();


	await resumeContext(ctx);

	envA.gain.value = 0;
	envB.gain.value = 0;

	var OscA = ctx.createOscillator();
	var OscB = ctx.createOscillator();
	/*var OscC = ctx.createOscillator();
	var OscD = ctx.createOscillator();*/


	const $frequencyA = document.createElement('input');
	  $frequencyA.type = 'range';
	  $frequencyA.id = 'Frequency';
	  $frequencyA.name = 'Frequency';
	  $frequencyA.min = 20;
	  $frequencyA.max = 1000;
	  $frequencyA.step = 1;
	  $frequencyA.value = 100;
	  $frequencyA.addEventListener('input', e => {
	    const frequencyA = parseFloat(e.target.value);
	    OscA.frequency.value = frequencyA;
	  });
	  document.body.appendChild($frequencyA);

	const $gain = document.createElement('input');
		$gain.type = 'range';
		$gain.id = 'Gain';
	  	$gain.name = 'Gain';
		$gain.min = 0;
		$gain.max = 1;
		$gain.step = 0.01;
		$gain.value = 0;
		$gain.addEventListener('input', e => {
			const vol = parseFloat(e.target.value);
			envA.gain.value = vol;
		});
		document.body.appendChild($gain);

	const $mod = document.createElement('input');
		$mod.type = 'range';
		$mod.id = 'ModulationAmount';
	  	$mod.name = 'ModulationAmount';
		$mod.min = 0;
		$mod.max = 100;
		$mod.step = 0.01;
		$mod.value = 0;
		$mod.addEventListener('input', e => {
			const mod = parseFloat(e.target.value);
			envB.gain.value = mod;
		})


		document.body.appendChild($mod);

	const $frequencyB = document.createElement('input');
		$frequencyB.type = 'range';
		$frequencyB.id = 'ModulationFrequency';
	  	$frequencyB.name = 'ModulationFrequency';
		$frequencyB.min = 20;
		$frequencyB.max = 500;
		$frequencyB.step = 0.1;
		$frequencyB.value = 20;
		$frequencyB.addEventListener('input', e => {
			const fB = parseFloat(e.target.value);
			OscB.frequency.value = fB;
		});
		document.body.appendChild($frequencyB);

	var labelFrequency = document.createElement('label');
		labelFrequency.htmlFor = 'Frequency';
		labelFrequency.innerHTML = 'Frequency  ';
	document.body.appendChild(labelFrequency);

	var labelGain = document.createElement('label');
		labelGain.htmlFor = 'Volume';
		labelGain.innerHTML = 'Volume  ';
	document.body.appendChild(labelGain);

	var labelMod = document.createElement('label');
		labelMod.htmlFor = 'ModulationAmount';
		labelMod.innerHTML = 'Modulation Amount  ';
	document.body.appendChild(labelMod);

	var labelModFreq = document.createElement('label');
		labelModFreq.htmlFor = 'ModulationFrequency';
		labelModFreq.innerHTML = 'Modulation Frequency ';
	document.body.appendChild(labelModFreq);



	OscA.start();
	OscB.start();

	OscB.connect(envB);
	envB.connect(OscA.frequency);
	OscA.connect(envA);
	envA.connect(out);

	envA.gain.cancelScheduledValues(now);
	envA.gain.linearRampToValueAtTime(1, now + 0.05);
	envA.gain.setValueAtTime(1, now + 0.005);
	envA.gain.exponentialRampToValueAtTime(0.0001, now + 3);

}

window.addEventListener('load', init);

$btn.addEventListener('click',init);