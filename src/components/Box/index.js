
import React, { useEffect, useRef,useLayoutEffect } from 'react'
import {useSelector,useDispatch} from 'react-redux'
import { changeBrushSize, changeColor } from '@/redux/slice/toolboxSlice'
import { MENU_ITEMS } from '@/constants'
import { actionItemClick } from '@/redux/slice/menuSlice'

import { socket } from '@/socket'

const Box = () => {
  const canvasRef = useRef(null)
  const shouldDrawRef = useRef(false)
  const dispatch = useDispatch()
  const drawHistory = useRef([])
  const historyPointer = useRef(0)
  const {activeMenuItem,actionMenuItem} = useSelector(state=>state.menu)
  const {color,size} = useSelector(state=>state.toolbar[activeMenuItem])


  useEffect(()=>{
    if(!canvasRef.current) return;
    const canvas  = canvasRef.current;
    const context = canvas.getContext('2d'); 

    if(actionMenuItem === MENU_ITEMS.DOWNLOAD){
      const URL = canvas.toDataURL()
      // console.log("url ",URL);
      const anchor = document.createElement('a')
      anchor.href = URL
      anchor.download = 'sketch.png'
      anchor.click()
    } else if(actionMenuItem === MENU_ITEMS.UNDO || actionMenuItem === MENU_ITEMS.REDO){
      if(historyPointer.current > 0 && actionMenuItem === MENU_ITEMS.UNDO) historyPointer.current-=1 
      if(historyPointer.current < drawHistory.current.length-1  && actionMenuItem === MENU_ITEMS.REDO) historyPointer.current+=1 
         const imageData = drawHistory.current[historyPointer.current]
         context.putImageData(imageData,0,0)
    }
    dispatch(actionItemClick(null))
    

  },[actionMenuItem])

  useEffect(()=>{
    if(!canvasRef.current) return;
    const canvas  = canvasRef.current;
    const context = canvas.getContext('2d');

    const changeConfig=(color,size)=>{

      context.strokeStyle=color
      context.lineWidth = size
    }

    const handleChangeConfig=(config)=>{
      changeConfig(config.color, config.size)
    }

    changeConfig(color,size)

    socket.on("changeConfig", handleChangeConfig)
    
    return ()=>{
      socket.off("changeConfig", handleChangeConfig)

    }
    
  },[color,size])

  //run before browser paint
  useLayoutEffect(()=>{
     if(!canvasRef.current) return;
     const canvas  = canvasRef.current;
     const context = canvas.getContext('2d');

     //when mounting
     canvas.width = window.innerWidth
     canvas.height = window.innerHeight


     const beginPath = (x,y)=>{
      context.beginPath()
      context.moveTo(x,y)
     }
     const drawLine = (x,y)=>{
      context.lineTo(x,y)
      context.stroke()
     }

     const handleMouseDown=(e)=>{
        shouldDrawRef.current = true
       beginPath(e.clientX,e.clientY)
       socket.emit('beginpath', {x:e.clientX , y:e.clientY})
        
     }    
     const handleMouseMove=(e)=>{
      if(!shouldDrawRef.current) return
      drawLine(e.clientX,e.clientY)
      socket.emit('drawline', {x:e.clientX , y:e.clientY})
     }
     const handleMouseUp=(e)=>{
      shouldDrawRef.current=false
      const imageData = context.getImageData(0,0, canvas.width,canvas.height)
      drawHistory.current.push(imageData)
      historyPointer.current= drawHistory.current.length-1;
     }

     const handleBeginPath=(path)=>{
      beginPath(path.x, path.y)
     }
     const handleDrawLinePath=(path)=>{
      drawLine(path.x, path.y)
     }

     
     canvas.addEventListener('mousedown',handleMouseDown)
     canvas.addEventListener('mousemove',handleMouseMove)
     canvas.addEventListener('mouseup',handleMouseUp)

    // socket.on("connect", ()=> {
    //   alert("client connected")
    // })

    socket.on('beginpath',handleBeginPath)
    socket.on('drawline',handleDrawLinePath)
    
     return ()=>{
     canvas.removeEventListener('mousedown',handleMouseDown)
     canvas.removeEventListener('mousemove',handleMouseMove)
     canvas.removeEventListener('mouseup',handleMouseUp)

     socket.off('beginpath',handleBeginPath)
     socket.off('drawline',handleDrawLinePath)
     
     }

    
     
  },[])
 
  return (
    <canvas ref={canvasRef}></canvas>
  )
}

export default Box