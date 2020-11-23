import { Component, ComponentClass, FunctionComponent } from "react";
import { FlatGrid } from "react-native-super-grid";

type scrollLoadListProps = {
    handleLoadData:function(callbackData):Promise<any[]>

    renderLoading:function(callbackData):Component
    renderFirstLoad:function(callbackData):Component
    renderEmpty:function(callbackData):Component
    renderError:function(callbackData):Component
}

type callbackData = {
    page:number
    dataList:any[]
    limit:number   
}

export default class scrollLoadList<props = any> extends FlatGrid<scrollLoadListProps<props>> {}