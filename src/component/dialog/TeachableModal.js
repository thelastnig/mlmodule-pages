import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Radar, 
	RadarChart, 
	PolarGrid, 
	PolarAngleAxis, 
	PolarRadiusAxis, 
	ResponsiveContainer, 
	LineChart, 
	Line,
	PieChart,
	Pie,
	XAxis, 
	YAxis, 
	CartesianGrid, 
	Tooltip, 
	Legend, 
	Label,
	Cell
} from 'recharts';
import AssessmentIcon from '@material-ui/icons/Assessment';
import { makeStyles } from '@material-ui/core/styles';
import PictureAsPdfOutlinedIcon from '@material-ui/icons/PictureAsPdfOutlined';
import PhotoLibraryOutlinedIcon from '@material-ui/icons/PhotoLibraryOutlined';
import CloseIcon from '@material-ui/icons/Close';
import { TEACHABLE_COLOR_LIST } from 'constants/common';
import NormalIcon from 'assets/icon/correct.png';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

// modal
import Dialog from '@material-ui/core/Dialog';
import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import { dialogList } from 'constants/dialog';

// export
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import FileSaver from 'file-saver';
import { WhiteBox } from 'views/userGroup';

const useStyles = makeStyles(() => ({
	paper: {
		paper: { minWidth: '1200px', maxWidth: '1200px' },
		height: '800px',
	},
}));

const mainColor = '#6B75CA';
const colorList = [ 
    {'name': 'pink', 'valueColor': '#F5D1D1'},
    {'name': 'yellow', 'valueColor': '#FFEDCB;'},
    {'name': 'green', 'valueColor': '#CFF4E8;'},
    {'name': 'blue', 'valueColor': '#D2E3FC'},
];
  
const backgroundColor = '#10111A';
const blockColor = '#201F32';
const yellowColor = '#F4D73C';
const greenColor = '#15B0A2';

const TeachableModal = (props) => {
    // modal
    const { dialogName } = useDialogState();
    const { hideDialog } = useDialogAction();
    const isShow = dialogName === dialogList.TEACHABLE_MODAL;
    const classes = useStyles();

    // train data
    const { taskType, taskSubType, params, list, detection_list, history, annotationData } = useHandleState();

    const data = list.map((item, index) => {
        return {
            subject: item.class_name,
            class: item.data.length 
        }
    });

    let lineData = [];
    let pieTrainData = [];
    let pieValData = [];
    let trainFinalMetric = 0;
    let valFinalMetric = 0;
    let trainFinalLoss = 0;
    let valFinalLoss = 0;

    if (history !== null) {
        const trainMetricList = history.history;

        if (taskType === 'image') {
            if (taskSubType === 'classification') {
                lineData = history.epoch.map((epoch, index) => {
                    if (trainMetricList.acc[index] === undefined ||
                        trainMetricList.val_acc[index] === undefined ||
                        trainMetricList.loss[index] === undefined ||
                        trainMetricList.val_loss[index] === undefined) {
                        return null;
                    } else {
                        return {
                            name: String(epoch + 1),
                            train: trainMetricList.acc[index].toFixed(3),
                            validation: trainMetricList.val_acc[index].toFixed(3),
                            trainLoss: trainMetricList.loss[index].toFixed(3),
                            validationLoss: trainMetricList.val_loss[index].toFixed(3),
                        }
                    }
                });
    
                if (lineData[lineData.length - 1] === null) {        
                    trainFinalMetric = (lineData[lineData.length - 2].train) * 100
                    valFinalMetric = (lineData[lineData.length - 2].validation) * 100;
                    trainFinalLoss = lineData[lineData.length - 2].trainLoss;
                    valFinalLoss = lineData[lineData.length - 2].validationLoss;
                } else {
                    trainFinalMetric = (lineData[lineData.length - 1].train) * 100
                    valFinalMetric = (lineData[lineData.length - 1].validation) * 100;
                    trainFinalLoss = lineData[lineData.length - 1].trainLoss;
                    valFinalLoss = lineData[lineData.length - 1].validationLoss;
                }
            
                pieTrainData = [
                    { name: "Train", value: trainFinalMetric},
                    { name: "Train left", value: 100-trainFinalMetric},
                ];
            
                pieValData = [
                    { name: "Val", value: valFinalMetric},
                    { name: "Val left", value: 100-valFinalMetric},
                ];
            } else {
                lineData = history.epoch.map((epoch, index) => {
                    if (trainMetricList.map[index] === undefined ||
                        trainMetricList.val_map[index] === undefined ||
                        trainMetricList.loss[index] === undefined ||
                        trainMetricList.val_loss[index] === undefined) {
                        return null;
                    } else {
                        return {
                            name: String(epoch + 1),
                            train: trainMetricList.map[index].toFixed(3),
                            validation: trainMetricList.val_map[index].toFixed(3),
                            trainLoss: trainMetricList.loss[index].toFixed(3),
                            validationLoss: trainMetricList.val_loss[index].toFixed(3),
                        }
                    }
                });
    
                if (lineData[lineData.length - 1] === null) {        
                    trainFinalMetric = (lineData[lineData.length - 2].train) * 100
                    valFinalMetric = (lineData[lineData.length - 2].validation) * 100;
                    trainFinalLoss = lineData[lineData.length - 2].trainLoss;
                    valFinalLoss = lineData[lineData.length - 2].validationLoss;
                } else {
                    trainFinalMetric = (lineData[lineData.length - 1].train) * 100
                    valFinalMetric = (lineData[lineData.length - 1].validation) * 100;
                    trainFinalLoss = lineData[lineData.length - 1].trainLoss;
                    valFinalLoss = lineData[lineData.length - 1].validationLoss;
                }
            
                pieTrainData = [
                    { name: "Train", value: trainFinalMetric},
                    { name: "Train left", value: 100-trainFinalMetric},
                ];
            
                pieValData = [
                    { name: "Val", value: valFinalMetric},
                    { name: "Val left", value: 100-valFinalMetric},
                ];

            }

        } else {
            lineData = history.epoch.map((epoch, index) => {
                if (trainMetricList.acc[index] === undefined ||
                    trainMetricList.loss[index] === undefined ) {
                    return null;
                } else {
                    return {
                        name: String(epoch + 1),
                        train: trainMetricList.acc[index].toFixed(3),
                        trainLoss: trainMetricList.loss[index].toFixed(3),
                    }
                }
            });

            if (lineData[lineData.length - 1] === null) {        
                trainFinalMetric = (lineData[lineData.length - 2].train) * 100
                trainFinalLoss = lineData[lineData.length - 2].trainLoss;
            } else {
                trainFinalMetric = (lineData[lineData.length - 1].train) * 100
                trainFinalLoss = lineData[lineData.length - 1].trainLoss;
            }
        
            pieTrainData = [
                { name: "Train", value: trainFinalMetric},
                { name: "Train left", value: 100-trainFinalMetric},
            ];
        }
    }
    
    const classItems = data.map((item, index) => {
        return (
            <ClassItem key={index} index={index}>
                <div className='classIndex'>{index + 1}</div>
                <div className='classText'>{item.subject}</div>
                <div className='classStatus'><CheckCircleIcon className='statusIcon' /></div>
                <div className='classCount'>{item.class}</div>
            </ClassItem>
        );
    });

    const annotationItems = Object.entries(annotationData).map(([key, value], index) => {
        return (
            <ClassItem key={index} index={index}>
                <div className='classIndex'>{index + 1}</div>
                <div className='classText'>{key}</div>
                <div className='classStatus'><CheckCircleIcon className='statusIcon' /></div>
                <div className='classCount'>{value}</div>
            </ClassItem>
        );
    });
        
    useEffect(() => {
		if (isShow) {
            console.log('open');
		} else {
            console.log('close');
		}
	}, [isShow]);

    const onCloseClicked = () => {
		hideDialog();
	};

    const exportReport = (exportType) => {    
        const input = document.getElementById('teachableReportArea');
        html2canvas(input)
        .then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            if (exportType === 'pdf') {
                const pdf = new jsPDF('p', 'pt', [canvas.width * 72 / 96, canvas.height * 72 / 96]);
                pdf.addImage(imgData, 'JPEG', 0, 0);
                pdf.save('report.pdf');
            } else {
                FileSaver.saveAs(imgData, 'report.png');

            }
        });
    }

	return (
        <div>	
        <Dialog
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className={'tabular_tabular_dlg dialog_layout'}
            classes={{ paper: classes.paper }}
            open={isShow}
            onClose={hideDialog}
        >
			<Wrapper>
				<InfoArea>
					<MenuArea>
                        <PictureAsPdfOutlinedIcon className='saveIcon first' onClick={() => exportReport('pdf')}/>
                        <PhotoLibraryOutlinedIcon className='saveIcon' onClick={() => exportReport('img')}/>
					</MenuArea>
                    <ContentArea id='teachableReportArea'>
                        <VisualizationArea>
                        <ChartArea>
                            <TitleArea>Training</TitleArea>
                            <ParameterArea>
                                <Parameter>
                                    <div className='parameterTitle'>Epoch</div>
                                    <div className='parameterValue'>{params.epochs}</div>
                                </Parameter>
                                <Parameter>
                                    <div className='parameterTitle'>Batch size</div>
                                    <div className='parameterValue'>{params.batch_size}</div>
                                </Parameter>
                                <Parameter>
                                    <div className='parameterTitle'>Learning rate</div>
                                    <div className='parameterValue'>{params.learning_rate}</div>
                                </Parameter>
                            </ParameterArea>
                                <Charts className='train'>
                                <ResponsiveContainer width={750} height={220}>
                                    <LineChart
                                        width={500}
                                        height={300}
                                        data={lineData}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid vertical={false} stroke="#343a40" />
                                        <XAxis
                                            tickMargin={5}
                                            tickLine={false}
                                            dataKey="name"
                                            axisLine={false}
                                            style={{
                                                    fontSize: '10px',
                                            }} />
                                        <YAxis
                                            tickMargin={5}
                                            tickLine={false}
                                            axisLine={false} 
                                            style={{
                                                    fontSize: '10px',
                                            }} />
                                        <Tooltip />
                                        <Legend align='right' iconSize={12}/>
                                        <Line type="monotone" dataKey="train" stroke={yellowColor} dot={false} strokeWidth={3}/>
                                        <Line type="monotone" dataKey="validation" stroke={greenColor} dot={false} strokeWidth={3}/>
                                    </LineChart>
                                </ResponsiveContainer>
                            <ResponsiveContainer width={750} height={220}>
                                <LineChart
                                    data={lineData}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid vertical={false} stroke="#343a40"/>
                                    <XAxis
                                        tickMargin={5}
                                        tickLine={false}
                                        dataKey="name"
                                        axisLine={false}
                                        style={{
                                                fontSize: '10px',
                                        }} />
                                    <YAxis
                                        tickMargin={5}
                                        tickLine={false}
                                        axisLine={false} 
                                        style={{
                                                fontSize: '10px',
                                        }} />3EA2EA
                                    <Tooltip />
                                    <Legend align='right' iconSize={12}/>
                                    <Line type="monotone" dataKey="trainLoss" stroke={yellowColor} dot={false} strokeWidth={3}/>
                                    <Line type="monotone" dataKey="validationLoss" stroke={greenColor} dot={false} strokeWidth={3}/>
                                </LineChart>
                            </ResponsiveContainer>
                            </Charts>
                            <MetricArea>
                                <Metric>
                                    <div className='metricTitle'>
                                        <AssessmentIcon className='titleIcon'/>
                                        <div className='titleText'>Train</div>
                                    </div>
                                    <div className='metricInfo'>
                                        <div>Accuracy</div>
                                        <div>Loss</div>
                                    </div>
                                    <div className='metricContent'>
                                        <div className='accuracyArea'>
                                            <ResponsiveContainer width={65} height={65}>
                                                <PieChart>
                                                    <Pie
                                                        data={pieTrainData}
                                                        nameKey="name"
                                                        dataKey="value"
                                                        cx="50%"
                                                        cy="50%"
                                                        startAngle={90}
                                                        endAngle={-270}
                                                        innerRadius={25}
                                                        outerRadius={32}
                                                        stroke="none">
                                                            {pieTrainData.map((entry, index) => {
                                                                if (index === 1) {
                                                                    return <Cell key={`cell-${index}`} fill={blockColor} />; 
                                                                }
                                                                return <Cell key={`cell-${index}`} fill={yellowColor}/>;
                                                            })}
                                                        <Label 
                                                            width={20}
                                                            fill='white'
                                                            position="center"
                                                            style={{
                                                                fontSize: "14px",
                                                            }}>
                                                            {String(trainFinalMetric.toFixed(1)) + '%'}
                                                        </Label>
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className='lossArea'>{trainFinalLoss}</div>
                                    </div>
                                </Metric>
                                
                                <Metric>
                                    <div className='metricTitle'>
                                        <AssessmentIcon className='titleIcon'/>
                                        <div className='titleText'>Validation</div>
                                    </div>
                                    <div className='metricInfo'>
                                        <div>Accuracy</div>
                                        <div>Loss</div>
                                    </div>
                                    {
                                        taskType === 'image'
                                        ?                                    
                                        <div className='metricContent'>
                                            <div className='accuracyArea'>
                                                <ResponsiveContainer width={65} height={65}>
                                                    <PieChart>
                                                        <Pie
                                                            data={pieValData}
                                                            nameKey="name"
                                                            dataKey="value"
                                                            cx="50%"
                                                            cy="50%"
                                                            startAngle={90}
                                                            endAngle={-270}
                                                            innerRadius={25}
                                                            outerRadius={32}
                                                            stroke="none">
                                                                {pieTrainData.map((entry, index) => {
                                                                    if (index === 1) {
                                                                        return <Cell key={`cell-${index}`} fill={blockColor} />; 
                                                                    }
                                                                    return <Cell key={`cell-${index}`} fill={yellowColor} />;
                                                                })}
                                                            <Label 
                                                                width={20}
                                                                fill='white'
                                                                position="center"
                                                                style={{
                                                                    fontSize: "14px",
                                                                }}>
                                                                {String(valFinalMetric.toFixed(1)) + '%'}
                                                            </Label>
                                                        </Pie>
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className='lossArea'>{valFinalLoss}</div>
                                        </div>
                                        :
                                        <div className='nullArea'>Not Available</div>         
                                    }
                                </Metric>

                            </MetricArea>
                        </ChartArea>
                        <DataArea>
                            <CloseButton>
                                <div className='dataText'><div>Data</div></div>
                                <CloseIcon className='closeIcon' onClick={onCloseClicked}/>
                            </CloseButton>
                            <DataContentArea isDetection={taskSubType === 'detection' ? true : false}>
                                {                                    
                                taskSubType === 'classification'
                                ?
                                <ResponsiveContainer width={340} height={340} className='responsiveContainer'>
                                    <RadarChart
                                        cx="50%"
                                        cy="50%"
                                        outerRadius="60%"
                                        data={data}
                                        style={{
                                            fontSize: '11px',
                                            color: '#343a40'
                                    }}
                                    >
                                        <PolarGrid gridType='circle' stroke={TEACHABLE_COLOR_LIST.HEAVY_GRAY}/>
                                        <PolarAngleAxis dataKey="subject" stroke={TEACHABLE_COLOR_LIST.HEAVY_GRAY}/>
                                        <PolarRadiusAxis stroke={TEACHABLE_COLOR_LIST.HEAVY_GRAY}/>
                                        <Radar
                                            name="test"
                                            dataKey="class"
                                            stroke={yellowColor}
                                            fill={yellowColor}
                                            fillOpacity={0.5}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                                :
                                <>
                                    <div className='dataInfo'>{detection_list[0].data.length} files</div>
                                    <div className='annotationInfo'>Annotation Info</div>
                                </>
                                }
                                <ClassItemArea isDetection={taskSubType === 'detection' ? true : false}>   
                                    <ClassHeaderArea>
                                        <div className='classIndex'>Index</div>
                                        <div className='classText'>Class Name</div>
                                        <div className='classStatus'>Status</div>
                                        <div className='classCount'>Count</div>
                                    </ClassHeaderArea>
                                    {
                                        taskSubType === 'classification'
                                        ?
                                        classItems
                                        :
                                        annotationItems
                                    }
                                </ClassItemArea>
                            </DataContentArea>      
                        </DataArea>
                        </VisualizationArea>
                        {/* <AnalysisArea>
                            <AnalysisItem>
                                <div className='analysisTitle'>데이터 분석<span> Data Analysis</span></div>
                                <div className='analysisDescription'><span>[Webcam]</span> 라벨에 속하는 데이터의 개수가 부족합니다.<br/>각 라벨에 속하는 데이터를 개수를 비슷하게 설정하세요.</div>
                            </AnalysisItem>
                            <AnalysisItem>
                                <div className='analysisTitle'>학습 결과 분석<span> Train Result Analysis</span></div>
                                <div className='analysisDescription'>학습 정확도에 비해 테스트 정확도가 낮아서 모델의 일반화 성능이 떨어집니다.<br/>일반화 성능을 높이기 위해 <span>[데이터 증강]</span>을 사용해보세요.</div>
                            </AnalysisItem>
                        </AnalysisArea> */}
                    </ContentArea>
				</InfoArea>
			</Wrapper>
		</Dialog>
        </div>
	);
};

export default TeachableModal;

const Wrapper = styled.div`
	width: 1200px;
	height: 100%;
	background: ${backgroundColor};
    overflow-x: hidden;
    overflow-y: hidden;
	margin: 0 auto;
	box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);

    .recharts-legend-item {
        font-size: 12px;
    } 
`;

const InfoArea = styled.div`
	width: 100%;
    height: 100%;
	display: flex;
	justify-content: center;
	align-items: flex-start;
`;

const MenuArea = styled.div`
	width: 65px;
	height: 100%;
	background: ${blockColor};
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;

    .saveIcon {
        font-size: 26px;
        color: white;
        margin-bottom: 30px;
        cursor: pointer;

        &.first {
            margin-top: 15px;
        }
    }
`;

const ContentArea = styled.div`
    width: calc(100% - 65px);
`;

const VisualizationArea = styled.div`
    width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const AnalysisArea = styled.div`
    width: 100%;
`;

const AnalysisItem = styled.div`
    width: calc(100% - 60px);
    background: white;
    height: 200px;
    margin: 0 auto;
    margin-top: 30px;
    margin-bottom: 30px;
	border-radius: 10px;

    .analysisTitle {
        width: calc(100% - 30px);
        font-size: 18px;
        font-weight: 600;
        color: #495057;
        margin: 0 auto;
        padding-top: 15px;
        padding-bottom: 15px;

        span {
            font-size: 14px;
            font-weight: 500;
            color: #868e96;
        }
    }

    .analysisDescription {
        width: calc(100% - 30px);
        height: 120px;
        margin: 0 auto;
        font-size: 14px;
        color: #495057;
        overflow-y: auto;

        span {
            color: ${mainColor};
            font-weight: 600;
        }
    }
`;

const ChartArea = styled.div`
	width: 795px;
    height: 800px;
`;

const Charts = styled.div`
	width: 775px;
	margin: 0 auto;
	margin-top: 50px;
	margin-bottom: 30px;
`;


const TitleArea = styled.div`
	width: calc(100% - 60px);
	height: 50px;
    line-height: 50px;
	margin: 0 auto;
    color: white;
`;


const ParameterArea = styled.div`
	width: calc(100% - 60px);
	height: 70px;
	margin: 0 auto;
	display: flex;
	justify-content: space-between;
`;

const Parameter = styled.div`
	width: 170px;
	height: 100%;
    color: white;
	background: ${blockColor};
	padding-left: 20px;
	padding-right: 20px;

    text-align: center;

	.parameterTitle {
        color: ${TEACHABLE_COLOR_LIST.GRAY};
		margin-top: 7px;
		font-size: 11px;
	}

	.parameterValue {
		margin-top: 7px;
		font-size: 20px;
	}
`;

const MetricArea = styled.div`
	width: calc(100% - 60px);
	height: 120px;
	margin: 0 auto;
	display: flex;
	justify-content: space-between;
`;

const Metric = styled.div`
	width: 340px;
	height: 130px;
	background: ${blockColor};

    .metricTitle {
        width: 310px
        height: 25px;
        margin: 0 auto;
        margin-top: 5px;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .titleIcon {
            margin-right: 5px;
            font-size: 20px;
            color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};

        }
        .titleText {
            color: ${TEACHABLE_COLOR_LIST.GRAY};
            font-size: 12px;
        }
    }

    .metricInfo {
        width: 270px
        height: 15px;
        margin: 0 auto;
        margin-bottom: 10px;
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        color: white;

        div {
            width: 50%;
            text-align: center;
        }
    }

    .metricContent {
        width: 270px;
        height: 65px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .accuracyArea {
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .lossArea {
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: white;
    }

    .nullArea {
        margin-top: 30px;
        font-size: 12px;
        text-align: center;
        color: ${TEACHABLE_COLOR_LIST.GRAY};
    }
`;

const DataArea = styled.div`
	width: 340px;
    height: 800px;
	background: ${backgroundColor};
`;

const CloseButton = styled.div`
	width: 100%;
	height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .closeIcon {
        cursor: pointer;
        margin-right: 10px;
        font-size: 24px;
        color: white;
    }

    .dataText {
        width: 150px;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        color: white;
        margin-left: 23px;
    }
`;

const DataContentArea = styled.div`
	width: 100%;
	margin: 0 auto;
    margin-top: 50px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
    ${props => props.isDetection && `
        margin-top: 0px;
    `}
    .dataInfo {
        width: 100%;
        text-align: left;
        font-size: 16px;
        color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
        font-weight: 600;
        margin-top: 7px;
        margin-bottom: 25px;
        padding-left: 30px;
    }
    .annotationInfo {
        width: 100%;
        text-align: left;
        font-size: 12px;
        color: white;
        margin-bottom: 8px;
        padding-left: 30px;
    }
`;

const ClassItemArea = styled.div`
	width: calc(100% - 60px);
    margin-top: 50px;
	height: 300px;
	overflow-y: auto;
    ${props => props.isDetection && `
        margin-top: 0px;
	    height: 640px;
    `}

    ::-webkit-scrollbar {
        width: 7px;
    }
    ::-webkit-scrollbar-thumb {
        background-color: #899095;
        border-radius: 7px;
        background-clip: padding-box;
    }
    ::-webkit-scrollbar-track {
        background-color: ${TEACHABLE_COLOR_LIST.GRAY};
        border-radius: 7px;
    }
`;


const ClassHeaderArea = styled.div`
    width: 100%;
    height: 40px;
    color: white;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    color: ${TEACHABLE_COLOR_LIST.GRAY};

    .classIndex {
        width: 20%;
    }

    .classText {
        width: 50%;
        text-align: left;
    }

    .classStatus {
        width: 15%;
    }

    .classCount {
        width: 15%;
    }


`;

const ClassItem = styled.div`
	width: 100%;
	height: 40px;
    color: white;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: #232234;
    ${props => (props.index % 2 === 1) && `
        background: ${blockColor};
    `}

    .classIndex {
        width: 20%;
        color: ${TEACHABLE_COLOR_LIST.GRAY};
    }

    .classText {
        width: 50%;
        text-align: left;
    }

    .classStatus {
        width: 15%;
        display: flex;
        justify-content: center;
        align-items: center;
        .statusIcon { 
            font-size: 18px;
            color: ${TEACHABLE_COLOR_LIST.GREEN_COLOR};
        }
    }

    .classCount {
        width: 15%;
    }
`;

const CloseButtonArea = styled.div`
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    .leftArea {
        width: 65px;
        height: 100%;
        background: white;
    }
    .rightArea {
        width: calc(100% - 65px);
        height: 100%;
        display: flex;
        justify-content: flex-end;
    }
    .closeButton {
        width: 100px;
        height: 40px;
        border-radius: 5px;
        color: white;
        line-height: 40px;
        text-align: center;
        background: ${mainColor};
        cursor: pointer;
        margin-right: 30px;
    }
`;

