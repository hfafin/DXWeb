import resumeContext from './resumeContext.js';



async function init()
{
	let ratio = 1;

	var ctx = new AudioContext();
	var out = ctx.destination;
	var envA = ctx.createGain();
	var envB = ctx.createGain();

	await resumeContext(ctx);

	envA.gain.value = 10;
	envB.gain.value = 10;

	var OscA = ctx.createOscillator();
	var OscB = ctx.createOscillator();
	/*var OscC = ctx.createOscillator();
	var OscD = ctx.createOscillator();*/


	const $frequencyA = document.createElement('input');
	  $frequencyA.type = 'range';
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
		$gain.min = 0;
		$gain.max = 100;
		$gain.step = 0.01;
		$gain.value = 0;
		$gain.addEventListener('input', e => {
			const vol = parseFloat(e.target.value);
			envA.gain.value = vol;
		});
		document.body.appendChild($gain);

	const $mod = document.createElement('input');
		$mod.type = 'range';
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
		$frequencyB.min = 20;
		$frequencyB.max = 1000;
		$frequencyB.step = 0.1;
		$frequencyB.value = 1;
		$frequencyB.addEventListener('input', e => {
			const fB = parseFloat(e.target.value);
			OscB.frequency.value = fB;
		});
		document.body.appendChild($frequencyB);

	OscA.start();
	OscB.start();

	OscB.connect(envB);
	envB.connect(OscA.frequency);
	OscA.connect(envA);
	envA.connect(out);
}

window.addEventListener('load', init);