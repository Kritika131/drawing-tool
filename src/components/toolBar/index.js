
import React from 'react'
import styles from './index.module.css'
import { COLORS, MENU_ITEMS } from '@/constants'
import {useSelector,useDispatch} from 'react-redux'
import { changeBrushSize, changeColor } from '@/redux/slice/toolboxSlice'
import cx from 'classnames'
const ToolBar = () => {

  const dispatch = useDispatch()
  const activeMenuItem = useSelector(state=>state.menu.activeMenuItem)
  const {color,size} = useSelector(state=>state.toolbar[activeMenuItem])

  const showStrokeToolOption = activeMenuItem===MENU_ITEMS.PENCIL
  const showBrushToolOption = activeMenuItem===MENU_ITEMS.PENCIL || activeMenuItem===MENU_ITEMS.ERASER

  const handleBrushSize=(e)=>{
      dispatch(changeBrushSize({item:activeMenuItem, size:e.target.value}))
  }
  const handleColor=(newColor)=>{
    
      dispatch(changeColor({item:activeMenuItem, color:newColor}))
  }
  return (
    <div className={styles.toolbarContainer}>
      {showStrokeToolOption && <div className={styles.toolItem}>
        <h4 className={styles.toolHeading}>Stroke Color</h4>
        <div className=
        {styles.itemContainer}>
          
          <div className={cx(styles.colorBox,{[styles.active]:color===COLORS.BLACK})} style={{backgroundColor:COLORS.BLACK}} onClick={()=>handleColor(COLORS.BLACK)}/>
          <div className={cx(styles.colorBox,{[styles.active]:color===COLORS.RED})} style={{backgroundColor:COLORS.RED}} onClick={()=>handleColor(COLORS.RED)}/>
          <div className={cx(styles.colorBox,{[styles.active]:color===COLORS.GREEN})} style={{backgroundColor:COLORS.GREEN}} onClick={()=>handleColor(COLORS.GREEN)}/>
          <div className={cx(styles.colorBox,{[styles.active]:color===COLORS.ORANGE})} style={{backgroundColor:COLORS.ORANGE}} onClick={()=>handleColor(COLORS.ORANGE)}/>
          <div className={cx(styles.colorBox,{[styles.active]:color===COLORS.YELLOW})} style={{backgroundColor:COLORS.YELLOW}} onClick={()=>handleColor(COLORS.YELLOW)}/>
          <div className={cx(styles.colorBox,{[styles.active]:color===COLORS.WHITE})} style={{backgroundColor:COLORS.WHITE}} onClick={()=>handleColor(COLORS.WHITE)}/>
        </div>
      </div> }
      
      {showBrushToolOption && <div className={styles.toolItem}>
        <h4 className={styles.toolHeading}>Brush Size {activeMenuItem}</h4>
        <div className= {styles.itemContainer}>
          <input type="range" min={1} max={10} step={1} onChange={handleBrushSize} value={size}  />
        </div>
      </div> }
      
    </div>
  )
}

export default ToolBar