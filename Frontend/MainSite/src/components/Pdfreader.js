import React, { useEffect, useState } from "react";
import axios from "axios";
import GenVid from "./Videogen.js";
import QuizApp from "./questions.js";
import DsaCompiler from "./dsa.js";
function Pdfreader() {
    const [resultText, setResultText] = useState('');
    const inpFileRef = React.createRef();
    const[enhance,setEnhance]=useState('')
    const[stack,setStack]= useState(["Hello ! Ask me a question?"])
    const[usermessage,setUser]=useState("")

    

    const HandleUpload = () => {
        const formData = new FormData();
        formData.append('pdfFile', inpFileRef.current.files[0]);

        fetch('/extract-text', {
            method: 'post',
            body: formData,
        })
        .then(response => response.text())
        .then(extractedText => {
            setResultText(extractedText.trim());

        })
        
          
    };
    const enhancetext=()=>{
        axios.post(('/enhancetext'),{
         text:resultText
        })
        .then(function(response){
         console.log(response.data.anaylsis)
         
         setEnhance(response.data.anaylsis)
        })
        .then(function (error){
         console.log(error)
        })
 }

 
 const response=()=>{
     setStack([...stack,usermessage])
     axios.post("/lessonresponse",{
         text:resultText,
         ques:usermessage
     })
     .then((response)=>{
         console.log(response.data.anaylsis)
         setStack([...stack,response.data.anaylsis])
     })
    
 }
 const sendmessage=()=>{
     setStack([...stack,usermessage])
 }
 const updatedata=(event)=>{
     setUser(event.target.value)
 }

    function Display() {
        return (
         <section class="watch-video">
              <div class="video-container">
<h1 class="heading">Study guide </h1>

<form action="" class="add-commentt">
</form>
           </div>
           <div class = "globalcontainer">
            
           
            <textarea
                class="globalsub"
                style={{ border: '1px rgba(0, 0, 0, 0.59) solid'}}
                value={resultText}
                placeholder="Your PDF text will appear here..."
                readOnly
            />
         
          </div>

          <textarea style={{width: 254, height: 682, left: 1280, top: 426, position: 'absolute', background: 'white',border: '1px rgba(0, 0, 0, 0.59) solid', borderRadius: 5}}  value={stack.map((message)=>{
               return message+"\n\n"
            })}
            placeholder="Neil tells ..."
            readOnly/>

<input type="text" style={{width: 239, height: 104, left:  1290, top: 990, position: 'absolute', background: 'white', borderRadius: 2, border: '1px rgba(0, 0, 0, 0.59) solid'}}
           onChange={updatedata}/>
<button  onClick={response} style={{width: 213, height: 29, left: 1300, top: 1060, position: 'absolute', background: 'rgba(188, 19, 254, 0.68)', borderRadius: 22}} >Clarify!</button>
<button  style={{width: 223.02, height: 0, left: 1300, top: 999, position: 'absolute', border: '1px rgba(0, 0, 0, 0.59) solid'}}>Type Here</button>


         <div class="video-container">
        
           
         </div>
         <div>
         <GenVid data={resultText}/>
         <QuizApp data={resultText}/>
         <DsaCompiler data={resultText}/>
         </div>
       </section >
        );
    }
    
    
    return (
        <section>
        <section>
        <h1 class="heading" >Select your PDF file ...</h1>
        
            <div className="add-comment2"  >
           
            <input type="file" class="globalbtn" ref={inpFileRef} />
            <button type="button" class="inline-option-btn" onClick={HandleUpload}>Upload</button>
            </div>
        </section>
       {resultText.length >0 && <Display/>}
       {resultText.length>0&& 
       <div>
         <input type="text" style={{width: 239, height: 104, left:  1290, top: 990, position: 'absolute', background: 'white', borderRadius: 2, border: '1px rgba(0, 0, 0, 0.59) solid'}}
         onChange={updatedata}/>
<button  onClick={response} style={{width: 213, height: 29, left: 1300, top: 1060, position: 'absolute', background: 'rgba(188, 19, 254, 0.68)', borderRadius: 22}} >Clarify!</button>
<button  style={{width: 223.02, height: 0, left: 1300, top: 999, position: 'absolute', border: '1px rgba(0, 0, 0, 0.59) solid'}}>Type Here</button>
         </div>}
       
    
    
     </section>
            
    )
}

export default Pdfreader;
