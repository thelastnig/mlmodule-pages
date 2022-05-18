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
  

const TeachableModal = (props) => {
    // modal
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.TEACHABLE_MODAL;
	const classes = useStyles();

    // train data
    const { params, list, history } = useHandleState();

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
    }
    
    const classItems = data.map((item, index) => {
        const colorIndex = index % colorList.length;
        const colorClass =  colorList[colorIndex].name;
        return (
            <ClassItem key={index}>
                <div className={'classIcons ' + colorClass}><div className='classIcon'>{item.subject.substr(0, 1).toUpperCase()}</div></div>
                <div className='classTitle'>
                    <div className='classMetaText'>Class Name</div>
                    <div className='classText'>{item.subject}</div>
                </div>
                <div className='classCount'>{item.class}<span> 개</span></div>
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
                                        <Line type="monotone" dataKey="train" stroke="#40c057" dot={false} strokeWidth={3}/>
                                        <Line type="monotone" dataKey="validation" stroke="#fcc419" dot={false} strokeWidth={3}/>
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
                                    <Line type="monotone" dataKey="trainLoss" stroke="#40c057" dot={false} strokeWidth={3}/>
                                    <Line type="monotone" dataKey="validationLoss" stroke="#fcc419" dot={false} strokeWidth={3}/>
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
                                                                    return <Cell key={`cell-${index}`} fill={TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND} />; 
                                                                }
                                                                return <Cell key={`cell-${index}`} fill={TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR}/>;
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
                                                                    return <Cell key={`cell-${index}`} fill={TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND} />; 
                                                                }
                                                                return <Cell key={`cell-${index}`} fill={TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR} />;
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
                                </Metric>

                            </MetricArea>
                        </ChartArea>
                        <DataArea>
                            <CloseButton>
                                <div className='dataText'><div>Data</div></div>
                                {/* <CloseIcon className='closeIcon' onClick={onCloseClicked}/> */}
                            </CloseButton>
                            <DataContentArea>
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
                                            stroke={TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR}
                                            fill={TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR}
                                            fillOpacity={0.5}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                                <ClassItemArea>
                                    {classItems}
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
                <CloseButtonArea>
                        <div className='leftArea'></div>
                        <div className='rightArea'>
                            <div className='closeButton' onClick={onCloseClicked}>닫기</div>
                        </div>
                    </CloseButtonArea>
			</Wrapper>
		</Dialog>
        </div>
	);
};

export default TeachableModal;

const Wrapper = styled.div`
	width: 1200px;
	height: 800px;
	background: ${TEACHABLE_COLOR_LIST.GRID_BACKGROUND};
    overflow-y: auto;
	margin: 0 auto;
	box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);

    .recharts-legend-item {
        font-size: 12px;
    } 

    ::-webkit-scrollbar {
        width: 7px;
    }
    ::-webkit-scrollbar-thumb {
        background-color: rgba(107, 117, 202, 0.7);
        border-radius: 7px;
        background-clip: padding-box;
    }
    ::-webkit-scrollbar-track {
        background-color: white;
        border-radius: 7px;
    }
`;

const InfoArea = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: flex-start;
`;

const MenuArea = styled.div`
	width: 65px;
	height: 1300px;
	background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_HARD};
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;

    .saveIcon {
        font-size: 26px;
        color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
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
	height: 810px;
`;

const Charts = styled.div`
	width: 775px;
	margin: 0 auto;
	margin-top: 50px;
	margin-bottom: 30px;
`;


const TitleArea = styled.div`
	width: calc(100% - 60px);
	height: 40px;
    line-height: 40px;
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
	background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND};
	padding-left: 20px;
	padding-right: 20px;

    text-align: center;

	.parameterTitle {
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
	height: 150px;
	background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND};

    .metricTitle {
        width: 310px
        height: 25px;
        margin: 0 auto;
        margin-top: 15px;
        display: flex;
        align-items: center;
        justify-content: flex-start;

        .titleIcon {
            margin-right: 5px;
            font-size: 20px;
            color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};

        }
        .titleText {
            color: white;
            font-size: 14px;
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
`;

const DataArea = styled.div`
	width: 340px;
	height: 810px;
	background: ${TEACHABLE_COLOR_LIST.GRID_BACKGROUND};
`;

const CloseButton = styled.div`
	width: 100%;
	height: 30px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .closeIcon {
        cursor: pointer;
        margin-right: 0px;
        font-size: 24px;
        color: #495057;
    }

    .dataText {
        width: 150px;
        height: 30px;
        font-size: 14px;
        color: white;
		font-weight: 600;
        margin-left: 23px;

        div {
            margin-top: 2px;
            margin-left: 20px;
            span {     
		        font-size: 14px;
                font-weight: 500;
            }
        }

    }
`;

const DataContentArea = styled.div`
	width: 100%;
	margin: 0 auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const ClassItemArea = styled.div`
	width: calc(100% - 60px);
	height: 400px;
	overflow-y: auto;

    ::-webkit-scrollbar {
        width: 5px;
    }
    ::-webkit-scrollbar-thumb {
        background-color: rgba(107, 117, 202, 0.7);
        border-radius: 5px;
        background-clip: padding-box;
    }
    ::-webkit-scrollbar-track {
        background-color: white;
        border-radius: 5px;
    }
`;

const ClassItem = styled.div`
	width: 100%;
	height: 80px;
	background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND};
	margin-bottom: 40px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    
    .classIcons {
        width: 50px;
        height: 50px;
        margin-left: 15px;
        border-radius: 25px;
        display: flex;
        justify-content: center;
        align-items: center;

        &.pink {
            background-color: ${colorList[0].valueColor};
        }
        &.yellow {
            background-color: ${colorList[1].valueColor};
        }
        &.green {
            background-color: ${colorList[2].valueColor};
        }
        &.blue {
            background-color: ${colorList[3].valueColor};
        }
    }

    .classIcon {
        font-size: 20px;
        font-weight: 600;
        color: #495057;
    }

    .classTitle {
        margin-left: 10px;
        width: 140px;
    }

    .classMetaText {
        font-size: 11px;
        color: #868e96;
    }

    .classText {
        font-size: 18px;
        color: #495057;
        font-weight: 600;
    }

    .classCount {
        text-align: right;
        font-size: 22px;
        font-weight: 600;
        color: ${mainColor};

        span {
            font-size: 12px;
            font-weight: 500;
            color: #868e96;
        }
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

