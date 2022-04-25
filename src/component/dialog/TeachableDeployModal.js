import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import SaveAltOutlinedIcon from '@material-ui/icons/SaveAltOutlined';
import { TEACHABLE_COLOR_LIST, TEACHABLE_MODEL_CONSTANT_LIST } from 'constants/common';
import agent from 'lib/apis';
import FileSaver from 'file-saver';
import JSZip from "jszip";

// modal
import Dialog from '@material-ui/core/Dialog';
import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { useAlertAction } from 'store/alert/hooks';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import { dialogList } from 'constants/dialog';

// Tab
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';

// Radio button
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

// markdown
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// code snippet
import { codeSnippetJS, codeSnippetPython, codeSnippetLite } from 'components/teachable/codeSnippet'


function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles({
	paper: {
		paper: { minWidth: '820px', maxWidth: '820px' },
		overflow: 'hidden'
	},
    root: {
        borderRadius: 0,
        border: 'none',
        boxShadow: '0px 0px 0px rgba(0, 0, 0, 0.0)'
    },
    tabbar: {
        borderRadius: 0,       
        fontWeight: 600,
        fontSize: 24,
        backgroundColor: TEACHABLE_COLOR_LIST.LIGHT_MAIN_COLOR,
        borderBottom: '1px solid ' +  TEACHABLE_COLOR_LIST.MIDDLE_LIGHT_MAIN_COLOR,
        indicatorColor: TEACHABLE_COLOR_LIST.HEAVY_MAIN_COLOR,
        paddingLeft: 30,
        paddingRight: 30,
    },
    tab: {
        color: TEACHABLE_COLOR_LIST.HEAVY_MAIN_COLOR,
        fontSize: 14,
        fontWeight: 600,
        textTransform: 'none'
    }
});

  
const TeachableDeployModal = (props) => {
    // modal
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.TEACHABLE_DEPLOY_MODAL;

    const onCloseClicked = () => {
		hideDialog();
    }

    // model
    const { model, metadata, isTrained } = useHandleState();

    // Alert
    const { showAlert } = useAlertAction();

    // Tab
    const classes = useStyles();
    const [ value, setValue ] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Radio button
    const [ modelTfType, setModelTfType ] = React.useState('keras');
    const [ modelLiteType, setModelLiteType ] = React.useState('tflite');
    const handleRadioChange = (event, type) => {
        if (type === 'tf') {
            setModelTfType(event.target.value);
        } else if (type === 'lite'){
            setModelLiteType(event.target.value);
        }
    };

    const checkVal= (key, val) => {
        if(typeof val === 'string'){
            try{return JSON.parse(val);}catch(e){}
      }
      return val;
    }

    // model download
    const handleClickDownload = (type) => {
        // model.save('downloads://my-image-model')
        const localStroagePath = 'localstorage://' + TEACHABLE_MODEL_CONSTANT_LIST.IMAGE_MODEL_DEFAUT_NAME;
        model.save(localStroagePath)
        .then(result => {
            const localStorageRoot = TEACHABLE_MODEL_CONSTANT_LIST.MODEL_ROOT_KEY + '/' + TEACHABLE_MODEL_CONSTANT_LIST.IMAGE_MODEL_DEFAUT_NAME;
            const weightBinary = localStorage.getItem(localStorageRoot + '/' + TEACHABLE_MODEL_CONSTANT_LIST.MODEL_WEIGHT_DATA_KEY);
            const weightSpec = localStorage.getItem(localStorageRoot + '/' + TEACHABLE_MODEL_CONSTANT_LIST.MODEL_WEIGHT_SPEC_KEY);
            const modelTopology = localStorage.getItem(localStorageRoot + '/' + TEACHABLE_MODEL_CONSTANT_LIST.MODEL_TOPOLOGY_KEY);
            const modelMetadata = localStorage.getItem(localStorageRoot + '/' + TEACHABLE_MODEL_CONSTANT_LIST.MODEL_METADATA_KEY);

            const modelInfo = {
                'modelTopology': modelTopology,
                'weightsManifest': [{
                    'paths': [
                       'weights.bin'
                    ],
                    'weights': weightSpec
                }]
            };
            const modelInfoJson = JSON.stringify(modelInfo, checkVal);
            const metadataJson = JSON.stringify(metadata);

            let zip = new JSZip();
            zip.file('model.json', modelInfoJson);
            zip.file('metadata.json', metadataJson);
            zip.file('weights.bin', weightBinary, {binary: true}); 
            zip.generateAsync({type: 'blob'})
            .then(content => {
                if (type === 'js') {
                    FileSaver.saveAs(content, 'model.zip');
                } else {                
                    const formData = new FormData();
                    const model_format = type === 'tf' ? modelTfType : modelLiteType;

                    formData.append('model', content);
                    formData.append('format', model_format);
                    agent
                    .convertTeachableModel(formData)
                    .then((response) => {
                        console.log('success');
                        const { model_path } = response.data;
                        const model_full_path = process.env.REACT_APP_API_ENDPOINT + '/api/models' + model_path;
                        const file_name = 'converted_model_' + model_format + '.zip'
                        FileSaver.saveAs(model_full_path, file_name);
                    })
                    .catch((error) => {
                        console.log('error ', error);
                        if (error.data.detail)
                            showAlert({
                                message: error.data.detail,
                            });
                        else
                            showAlert({
                                message: error.statusText,
                            });
                    })
                    .finally((v) => {});
                }                
            });    
        })
        .catch(error => {
            console.log(error);
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
                <MenuArea>
                    <InfoArea>
                        <div className='infoText'>프로젝트에서 모델을 사용하려면 모델을 내보내세요.</div>
                        <CloseOutlinedIcon className='closeIcon' onClick={onCloseClicked}/>
                    </InfoArea>
                </MenuArea>
                <ContentArea>
                    <Paper className={classes.root}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        className={classes.tabbar}
                    >
                        <Tab label="Tensorflow.js" className={classes.tab} {...a11yProps(0)} />
                        <Tab label="Tensorflow" className={classes.tab}  {...a11yProps(1)} />
                        <Tab label="Tensorflow Lite" className={classes.tab}  {...a11yProps(2)} />
                    </Tabs>
                    <TabPanel value={value} index={0} className='tabPanel'>
                        <div className='tabItem'>
                            <div className='tabItemInfoText'>모델 내보내기</div>
                            {
                            isTrained
                            ?
                            <div className='downloadBtnWrapper' onClick={() => handleClickDownload('js')}>
                                <SaveAltOutlinedIcon className='downloadBtn'/>
                                <div className='downloadBtnText'>모델 다운로드</div>
                            </div>
                            :
                            <div className='downloadBtnWrapper disable'>
                                <SaveAltOutlinedIcon className='downloadBtn disable'/>
                                <div className='downloadBtnText disable'>모델 다운로드</div>
                            </div>

                            }
                            <div className='tabItemInfoText'>모델에서 사용할 코드 스니펫</div>
                            <div className='codeArea'>
                                <SyntaxHighlighter language="javascript" style={a11yDark}>
                                {codeSnippetJS}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={1} className='tabPanel'>
                        <div className='tabItem'>
                            <div className='tabItemInfoText'>모델 내보내기</div>
                            <div className='downloadArea'>
                                <div className='radioBtnWrapper'>
                                    <FormControl component="fieldset">
                                    <RadioGroup row aria-label="position" name="position" defaultValue="top" value={modelTfType} onChange={(e) => handleRadioChange(e, 'tf')}>
                                        <FormControlLabel value="keras" control={<Radio color="primary" />} label="Keras" />
                                        <FormControlLabel value="savedmodel" control={<Radio color="primary" />} label="Savedmodel" />
                                    </RadioGroup>
                                    </FormControl>
                                </div>
                                {
                                isTrained
                                ?
                                <div className='downloadBtnWrapper radio' onClick={() => handleClickDownload('tf')}>
                                    <SaveAltOutlinedIcon className='downloadBtn'/>
                                    <div className='downloadBtnText'>모델 다운로드</div>
                                </div>
                                :
                                <div className='downloadBtnWrapper radio disable'>
                                    <SaveAltOutlinedIcon className='downloadBtn'/>
                                    <div className='downloadBtnText disable'>모델 다운로드</div>
                                </div>
                                }
                            </div>
                            <div className='tabItemInfoText'>모델에서 사용할 코드 스니펫</div>
                            <div className='codeArea'>
                                <SyntaxHighlighter language="python" style={a11yDark}>
                                {codeSnippetPython}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel value={value} index={2} className='tabPanel'>
                        <div className='tabItem'>
                            <div className='tabItemInfoText'>모델 내보내기</div>
                            <div className='downloadArea'>
                                <div className='radioBtnWrapper'>
                                    <FormControl component="fieldset">
                                    <RadioGroup row aria-label="position" name="position" defaultValue="top" value={modelLiteType} onChange={(e) => handleRadioChange(e, 'lite')}>
                                        <FormControlLabel value="tflite" control={<Radio color="primary" />} label="부동 소수점" />
                                        <FormControlLabel value="tflite_quantized" control={<Radio color="primary" />} label="양자화됨" disabled/>
                                        <FormControlLabel value="edgetpu" control={<Radio color="primary" />} label="EdgeTPU" disabled/>
                                    </RadioGroup>
                                    </FormControl>
                                </div>
                                {
                                isTrained
                                ?
                                <div className='downloadBtnWrapper radio' onClick={() => handleClickDownload('lite')}>
                                    <SaveAltOutlinedIcon className='downloadBtn'/>
                                    <div className='downloadBtnText'>모델 다운로드</div>
                                </div>
                                :
                                <div className='downloadBtnWrapper radio disable'>
                                    <SaveAltOutlinedIcon className='downloadBtn'/>
                                    <div className='downloadBtnText disable'>모델 다운로드</div>
                                </div>
                                }
                            </div>
                            <div className='tabItemInfoText'>모델에서 사용할 코드 스니펫</div>
                            <div className='codeArea'>
                                <SyntaxHighlighter language="javascript" style={a11yDark}>
                                {codeSnippetLite}
                                </SyntaxHighlighter>
                            </div>
                        </div>
                    </TabPanel>
                    </Paper>
                </ContentArea>
			</Wrapper>
		</Dialog>
        </div>
	);
};

export default TeachableDeployModal;

const Wrapper = styled.div`
	width: 820px;
	height: 670px;
	background: #FFFFFF;
	border-radius: 15px;
	margin: 0 auto;
`;

const MenuArea = styled.div`
	width: 100%;
    height: 75px;
    background: ${TEACHABLE_COLOR_LIST.LIGHT_MAIN_COLOR};
`;

const InfoArea = styled.div`
    height: 75px;
    padding-left: 30px;
    padding-right: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .infoText {
        line-height: 75px;
        color: ${TEACHABLE_COLOR_LIST.HEAVY_MAIN_COLOR};
        font-size: 18px;
    }

    .closeIcon {
        color: ${TEACHABLE_COLOR_LIST.HEAVY_MAIN_COLOR};
        font-size: 24px;
        cursor: pointer;
    }
`;

const ContentArea = styled.div`
    width: 100%;

    .tabPanel {
        height: 550px;
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
            background-color: rgba(174, 203, 250, 0.7);
            border-radius: 7px;
            background-clip: padding-box;
        }
        ::-webkit-scrollbar-track {
            background-color: white;
            border-radius: 7px;
        }
    }

    .tabItem {
        height: 700px;
    }

    .tabItemInfoText {
        margin-bottom: 30px;
    }

    .downloadArea {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 50px;
    }

    .radioBtnWrapper {
        margin-right: 30px;
    }

    .downloadBtnWrapper {
        width: 200px;
        height: 42px;
        background: ${TEACHABLE_COLOR_LIST.LIGHT_MAIN_COLOR};
        color: ${TEACHABLE_COLOR_LIST.HEAVY_MAIN_COLOR};
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 50px;

        &.disable {
            background: ${TEACHABLE_COLOR_LIST.LIGHT_GRAY};
            color: ${TEACHABLE_COLOR_LIST.HEAVY_GRAY};
            cursor: default;

            :hover {
                background: ${TEACHABLE_COLOR_LIST.LIGHT_GRAY};
                font-weight: 500;
            }
        }

        &.radio {
            margin-bottom: 0px;
        }

        :hover {
            background: ${TEACHABLE_COLOR_LIST.MIDDLE_LIGHT_MAIN_COLOR};
            font-weight: 600;
        }

        .downloadBtnText {
            margin-left: 10px;
            text-align: center;
        }
    }

    .codeArea {
        padding-bottom: 30px;
    }
`;

