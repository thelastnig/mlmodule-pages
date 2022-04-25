import React, {useState} from 'react';
import './popup.css';

export default function Popup(props){
    // const data = [
	// 	{title:'check_dataset',value:'done'},
	// 	{title:'zip_file_extraction',value:'done'},
	// 	{title:'label_processing',value:'not yet'},		
	// 	{title:'check_dataset',value:'done'},
	// 	{title:'zip_file_extraction',value:'done'},
	// 	{title:'label_processing',value:'not yet'},		
	// 	{title:'check_dataset',value:'done'},
	// 	{title:'zip_file_extraction',value:'done'},
	// 	{title:'label_processing',value:'not yet'},		
	// 	{title:'check_dataset',value:'done'},
	// 	{title:'zip_file_extraction',value:'done'},
	// 	{title:'label_processing',value:'not yet'},		
	// 	{title:'check_dataset',value:'done'},
	// 	{title:'zip_file_extraction',value:'done'},
	// 	{title:'label_processing',value:'not yet'},		
	// 	{title:'check_dataset',value:'done'},
	// 	{title:'zip_file_extraction',value:'done'},
	// 	{title:'label_processing',value:'not yet'},		
	// 	{title:'check_dataset',value:'done'},
	// 	{title:'zip_file_extraction',value:'done'},
	// 	{title:'label_processing',value:'not yet'},		
	// 	{title:'check_dataset',value:'done'},
	// 	{title:'zip_file_extraction',value:'done'},
	// 	{title:'label_processing',value:'not yet'},		
	// 	{title:'check_dataset',value:'done'},
	// 	{title:'zip_file_extraction',value:'done'},
	// 	{title:'label_processing',value:'not yet'},		
	// 	{title:'check_dataset',value:'done'},
	// 	{title:'zip_file_extraction',value:'done'},
	// 	{title:'label_processing',value:'not yet'},		
	// 	{title:'check_dataset',value:'done'},
	// 	{title:'zip_file_extraction',value:'done'},
	// 	{title:'label_processing',value:'not yet'},		
	// 	{title:'check_dataset',value:'done'},
	// 	{title:'zip_file_extraction',value:'done'},
	// 	{title:'label_processing',value:'not yet'},		
	// ];

	
    var data = [];
    
    const { title, status } = props;
    // var msg = "{\"data1\":\"done\",\"data2\":\"not yet\"}";
    if(status != null && status.includes("doesn\'t exist")!=true){
        var msg = JSON.parse(status);   
        if(msg != null){
            for (var key in msg){
                data = data.concat({title:key, value:msg[key]});
            }
            console.log(data);
        }
    }

    const List = () => (
        <ul>
            {data.map(item=>(
                <li key={item.title}>
                    <div>{item.title}:{item.value.toString()}</div>					
                </li>
            ))}
        </ul>		
	);    

    return (
        <div className='popup'>
            <div className='popup_inner'>
                <div className='popup_inner_top'><b>{title}</b></div>
                <div className='popup_inner_bottom'> 
                    {data.length > 0?<List/>:null}
                </div>
            </div>
        </div>
    );
}