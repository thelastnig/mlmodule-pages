export const graphDataParser = (rawGraphData) => {
	let graphData = null;

	if (rawGraphData !== null) {
		const resultKeys = Object.keys(rawGraphData);
		let trainKeys = [];
		resultKeys.map((key) => {
			if (key.includes('train')) {
				trainKeys.push(key);
			}
		});
		let valKeys = [];
		resultKeys.map((key) => {
			if (key.includes('val')) {
				valKeys.push(key);
			}
		});

		let trainGraphData = {};
		trainKeys.forEach((item) => {
			trainGraphData[item] = rawGraphData[item];
		});

		let valGraphData = {};
		valKeys.forEach((item) => {
			valGraphData[item] = rawGraphData[item];
		});

		graphData = {
			trainGraphData: trainGraphData,
			valGraphData: valGraphData,
		};
	}

	return graphData;
};

export const analyzedData2DParser = (rawGraphData) => {
	let xList = [];
	let yList = [];
	let nameList = [];
	let dataList = rawGraphData.split('\n');

	const label = dataList.shift();
	const labelList = label.split(',');
	const labelLength = labelList.length;

	dataList.map((data) => {
		let splictedData = data.split(',');
		splictedData.shift();
		xList.push(splictedData[0]);
		yList.push(splictedData[1]);
	});

	const result = {
		xList: xList,
		yList: yList,
		nameList: nameList,
		labelLength: labelLength,
		type: 'analyze',
	};
	return result;
};

export const analyzedData3DParser = (rawGraphData) => {
	let xList = [];
	let yList = [];
	let zList = [];
	let dataList = rawGraphData.split('\n');
	dataList.shift();

	dataList.map((data) => {
		let splictedData = data.split(',');
		splictedData.shift();
		xList.push(splictedData[0]);
		yList.push(splictedData[1]);
		zList.push(splictedData[2]);
	});

	const result = {
		xList: xList,
		yList: yList,
		zList: zList,
	};
	return result;
};

export const inferData2DParser = (rawGraphData) => {
	let xList = [];
	let yList = [];
	let nameList = [];

	rawGraphData.map((data) => {
		data['label'].map((labelItem, index) => {
			xList.push(labelItem);
			yList.push(data['prob'][index]);
			nameList.push(data['file_name']);
		});
	});

	const result = {
		xList: xList,
		yList: yList,
		nameList: nameList,
		type: 'infer',
	};

	return result;
};

export const strToJsonConverter = (rawStr) => {
	let result = [];
	if (rawStr === null || rawStr === '') {
		return result;
	}

	if (rawStr === '[]') {
		return 'tabular';
	}

	let tempStr = rawStr.slice(1).slice(0, -1);

	let tempArray = tempStr.split('},');
	if (tempArray.length < 1) {
		return result;
	}

	for (let i = 0; i < tempArray.length; i++) {
		const fullStr = tempArray[i].indexOf('}') === -1 ? tempArray[i] + '}' : tempArray[i];
		result.push(JSON.parse(fullStr));
	}
	return result;
};

export const metricDataParser = (graphData) => {
	let metricData = null;
	let metricName = null;
	let isLoss = false;

	if (graphData !== null) {
		const resultKeys = Object.keys(graphData);
		let trainKeys = [];
		resultKeys.map((key) => {
			if (key.includes('final') && key.includes('train')) {
				trainKeys.push(key);
				if (key.includes('loss')) {
					isLoss = true;
				} else {
					metricName = key.substring(12, key.length)
				}
			}
		});
		let valKeys = [];
		resultKeys.map((key) => {
			if (key.includes('final') && key.includes('valid')) {
				valKeys.push(key);
			}
		});
		let testKeys = [];
		resultKeys.map((key) => {
			if (key.includes('final') && key.includes('test')) {
				testKeys.push(key);
			}
		});

		let trainMetricData = {};
		trainKeys.forEach((item) => {
			trainMetricData[item] = graphData[item];
		});

		let valMetricData = {};
		valKeys.forEach((item) => {
			valMetricData[item] = graphData[item];
		});

		let testMetricData = {};
		testKeys.forEach((item) => {
			testMetricData[item] = graphData[item];
		});

		metricData = {
			trainMetricData: trainMetricData,
			valMetricData: valMetricData,
			testMetricData: testMetricData,
			metricName: metricName,
			isLoss: isLoss
		};
	}

	return metricData;
};

export const finalMetricDataParser = (data) => {
	let metricKey = null;
	let lossKey = null;
	if (data) {
		const trainKeys = Object.keys(data);
		trainKeys.map((key) => {
			if (key.includes('loss')) {
				lossKey = data[key][0];
			} else {
				metricKey = data[key][0];
			}
		});
	}

	const result = {
		metricKey: metricKey,
		lossKey: lossKey
	}

	return result
};