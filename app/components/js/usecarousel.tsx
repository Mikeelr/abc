import { useEffect, useState } from "react";

export default function useCarousel({parentId,handlerId,indicatorId}:{parentId:string,handlerId?:string,indicatorId?:string}){
    const [currIndex,setCurrIndex]=useState(0)
    let index=0
    const forward=(len:number)=>{
        
       index = (index+1)%len;
       setCurrIndex(index);
    }
    const backward=(len:number)=>{
        index = (index+len-1)%len;
       

        setCurrIndex(()=>index)
     

    }
    useEffect(()=>{

const parent = document.getElementById(parentId) as HTMLDivElement

const pChildren=parent.children;
if(handlerId){
    const handler= document.getElementById(handlerId) as HTMLDivElement
const sChildren=handler.children;
for(let i=0; i<sChildren.length;i++){
    const child=sChildren.item(i) as HTMLSpanElement;
    const length=pChildren.length
    child.addEventListener("click",()=>{
      
        i==0? backward(length):forward(length)
        
    }
        
    )
}
}
if(indicatorId){
    const handler= document.getElementById(indicatorId) as HTMLDivElement
    const sChildren=handler.children;
    for(let i=0; i<sChildren.length;i++){
        const child=sChildren.item(i) as HTMLSpanElement;
       
       
        child.addEventListener("click",()=>{
            setCurrIndex(i)
            index=i
        })
    }
   
        
    
}
const inv =setInterval(()=>{
    forward(pChildren.length)    
},8000)

return ()=>{
    clearInterval(inv)
}

    },[])
    useEffect(()=>{
        const parent = document.getElementById(parentId) as HTMLDivElement

const pChildren=parent.children;
if(indicatorId){
    const handler= document.getElementById(indicatorId) as HTMLDivElement
    const sChildren=handler.children;

    for(let i=0;i<pChildren.length;i++){
        const child=sChildren.item(i) as HTMLSpanElement;
        child.style.backgroundColor=currIndex==i?"var(--p)":"transparent"
        // child.style.padding=currIndex==i?"0px 24px":"0px"
    }
       
    
}

for(let i=0;i<pChildren.length;i++){
    const child= pChildren.item(i) as HTMLDivElement;
 
child.style.transition="1.5s";
child.style.position="absolute";
child.style.opacity=currIndex==i?"1":"0";
child.style.translate=currIndex==i ?"0px 0px":"-100vw 0px"
}


    },[currIndex])
}