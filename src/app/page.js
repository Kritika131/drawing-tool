"use client" 
import Box from '@/components/Box'
import Menu from '@/components/menu'
import ToolBar from '@/components/toolBar'
import { store } from '@/redux/store/store'
import {Provider} from 'react-redux'


export default function Home() {
  return (
    <Provider store={store}>
    <div>
    <Menu/>
    <ToolBar/>
    <Box/>
    </div> 
     </Provider>
  )
}
