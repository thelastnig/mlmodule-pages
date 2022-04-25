class DataParser {
	//TODO 삭제할것
	static parseExperimentDetail(detail) {
		return {
			datasplit: (detail && detail.datasplit) ? detail.datasplit : '',
			dataAlgorithm: (detail && detail.algorithm) ? detail.algorithm : '',
			dataResource: (detail && detail.resource) ? detail.resource : '',
			dataParam: (detail && detail.params) ? detail.params : '',
			log: (detail && detail.log) ? detail.log : null,
			dataGraph: (detail && detail.graph) ? detail.graph : null,
			dataset: (detail && detail.dataset) ? detail.dataset : null,
			projectType: (detail && detail.project_type) ? detail.project_type : null,
			dataHpoSettings: (detail && detail.hpo_settings) ? detail.hpo_settings : null,
			trainType: (detail && detail.train_type) ? detail.train_type : null,
		};
	}

	static parseGPU(data) {
		return (data) ? `${data.gpu_type} ${data.gpu_size} , ${data.gpu_display}` : '';
	}

	static parseCPU(data) {
		return (data) ? `${data.cpu_size} core` : '';
	}

	static parseRAM(data) {
		return (data) ? `${data.memory_size} GB` : '';
	}
}

export default DataParser;
