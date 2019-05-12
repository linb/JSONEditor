xui.Class('App.TreeView', 'xui.Module',{
    Instance:{
        setValue:function(str){
            var ns=this;

            ns.$code=str;

            ns.tg.removeAllRows().busy();
            xui.asyRun(function(){
                var obj=xui.unserialize(str),
                    rows=ns._json2rows(obj, ns._rootArr = xui.isArr(obj));
                ns.tg.insertRows(rows).free();
            });
        },
        getValue:function(){
            var rows=this.tg.getRows();
            return this._rows2json(rows, this._rootArr);
        },

        iniComponents:function(){
            // [[Code created by CrossUI RAD Studio
            var host=this, children=[], append=function(child){children.push(child.get(0));};
            
            append(
                (new xui.UI.Layout())
                .setHost(host,"layout7")
                .setItems([{
                    "id" : "before",
                    "pos" : "before",
                    "size" : 30,
                    "locked" : true,
                    "min" : 10,
                    "folded" : false,
                    "cmd" : false,
                    "hidden" : false
                },{
                    "id" : "main",
                    "min" : 10,
                    "size" : 80
                }])
                .setType("horizontal")
            );
            
            host.layout7.append(
                (new xui.UI.TreeGrid())
                .setHost(host,"tg")
                .setRowNumbered(false)
                .setEditable(true)
                .setTreeMode('infirstcell')
                .setIniFold(false)
                .setColSortable(false)
                .setRowHandler(false)
                .setTogglePlaceholder(true)
                .setHeader([{
                    "id" : "key",
                    "width" : 180,
                    "type" : "input",
                    "caption" : "key",
                    "editorCacheKey":"input"
                },{
                    "id" : "value",
                    "width" : 400,
                    "type" : "textarea",
                    "caption" : "value",
                    "editorCacheKey":"textarea"
                }])
                .setTagCmds([{
                    "id" : "add",
                    "type" : "text",
                    "caption" : "",
                    "location": "right",
                    "itemClass":"xuicon xui-uicmd-getter",
                    "tag" : "header row",
                    "tips" : "Append a child"
                },{
                    "id" : "up",
                    "type" : "text",
                    "location": "right",
                    "itemClass":"xuicon xui-icon-arrowtop",
                    "tag" : "row",
                    "tips" : "Add a node to the front of the node" 
                },{
                    "id" : "down",
                    "type" : "text",
                    "location": "right",
                    "itemClass":"xuicon xui-icon-arrowbottom",
                    "tag" : "row",
                    "tips" : "Add a node at the back of this node"
                },{
                    "id" : "del",
                    "type" : "text",
                    "location": "right",
                    "itemClass":"xuicon xui-uicmd-close",
                    "tag" : "row",
                    "tips" : "Delete this node"
                }])
                .onCmd("_tg_oncmd")
                .beforeIniEditor("_tg_beforeIniEditor")
                .onBeginEdit("_tg_onEdit")
                .beforeCellUpdated("_tg_beforecellupdated")
                , "main");
            
            host.layout7.append(
                (new xui.UI.Button())
                .setHost(host,"button26")
                .setDock("fill")
                .setLeft(20)
                .setTop(110)
                .setCaption("<")
                .onClick("_button26_onclick")
                .setCustomStyle({
                    "KEY" : "background:#eee;"
                })
                , "before");
            
            return children;
            // ]]Code created by CrossUI RAD Studio
        },
        _button26_onclick:function (profile, e, src, value) {
            SPA.toCodeView();
        },
        _getCellValue:function(n){
            var ns=this, v;
            try{
                v=xui.str.trim(n);
                //special string
                if(/^'/.test(v) && !ns._isString(v.slice(1))){
                    v=['string', v.slice(1)];
                }else{
                    v=v.replace(/^\s*/,'').replace(/\s*$/,'');
                    v= v=='null'? ['null','null'] :
                      //number
                        xui.isFinite(v) ? ['number',v]  :
                      //reg
                        /^\/(\\[\/\\]|[^*\/])(\\.|[^\/\n\\])*\/[gim]*$/.test(v) ? ['regexp', v]  :
                      //bool
                        /^(true|false)$/.test(v) ? ['boolean',v.toLowerCase()] :
                      //date
                        /^new Date\([0-9 \,]*\)$/i.test(v) ? ['date', xui.serialize(xui.unserialize(v))] :
                      //function
                        /^((function\s*([\w$]+\s*)?\(\s*([\w$\s,]*)\s*\)\s*)(\{([^\{\}]*)\}))$/i.test(v) ? ['function',v] :
                      //hash
                        /^\{[\s\S]*\}$/.test(v) ? ['hash',xui.stringify(xui.unserialize(v))] :
                      //array
                        /^\[[\s\S]*\]$/.test(v) ? ['array', xui.stringify(xui.unserialize(v))] :
                      ['string', n];
                  }
              }catch(e){
                  v=null;
              }
              if(v[0]=='string'){
                if(v[1]===false)
                    return null;
                v[1]=xui.stringify(v[1]);
            }
            if(v[1]==="false" && v[0]!='string')
                v[0]='boolean';
            return v;
        },
        _json2rows:function(obj,array,rows){
            var ns=this, me=arguments.callee;
            if(!rows)rows=[];
            xui.each(obj,function(o,i){
                var row={},type=ns._getType(o);
                i={value:array?'['+i+']':i,readonly:array};

                if(type=='hash'){
                    row.sub=[];
                    row.cells=[i,{value:'{...}'},''];
                    me.call(ns, o,false,row.sub);
                }else if(type=='array'){
                    row.sub=[];
                    row.cells=[i,{value:'[...]'},''];
                    me.call(ns, o,true,row.sub);
                }else{
                    ns._getType(o);
                    row.cells=[i,xui.stringify(o),''];
                }
                row._type=type;
                row.caption="";
                rows.push(row);
            });
            return rows;
        },
        _getType:function(o){
            return o===null?null:
                    xui.isStr(o)?'string':
                    xui.isNumb(o)?'number':
                    xui.isHash(o)?'hash':
                    xui.isArr(o)?'array':
                    xui.isBool(o)?'boolean':
                    xui.isDate(o)?'date':
                    xui.isReg(o)?'regexp':
                    xui.isFun(o)?'function':
                    'undefined';
        },
        _rows2json:function(arr,array){
            var me=arguments.callee,
                a=[], key,value;
            xui.arr.each(arr, function(o){
                key=((typeof o.cells[0]=='object')?o.cells[0].value:o.cells[0]);
                if(o._type=='hash')
                    value=me(o.sub);
                else if(o._type=='array')
                    value=me(o.sub, true);
                else
                    value=(typeof o.cells[1]=='object')?o.cells[1].value:o.cells[1];
                if(array)
                    a.push(value);
                else
                    a.push('"'+key + '":' + value);
            });
            return array ? '['+a.join(',')+']' : '{'+a.join(',')+'}';
        },
        _tg_onEdit:function(profile, obj, editor, type){
            editor.getSubNode("INPUT").css("font-size", "1.3em").scrollTop(0);
            editor.reLayout(true);
        },
            // for value 
        _tg_beforeIniEditor:function(profile, obj, cellNode, pNode, type){
            var ns=this;
            if(type!='cell')return;
            if(obj._col.id!='value')return;

            var type=obj._row._type;
            if(type=='hash'||type=='array'){
                obj.$editorValue = xui.Coder.formatText(this._rows2json(obj._row.sub, type=='array'));
            }else if(type=='string'){
                var v=xui.unserialize(obj.value);
                      //number
                if(  !ns._isString(v) ){
                    obj.$editorValue = "'" + v;
                }else{
                    obj.$editorValue = v
                }
            }
        },
        _isString:function(v){
            return !(v=='undifined' || v=='null' || v=='NaN' ||
                       xui.isFinite(v) ||
                      //reg
                        /^\/(\\[\/\\]|[^*\/])(\\.|[^\/\n\\])*\/[gim]*$/.test(v)  ||
                      //bool
                        /^(true|false)$/.test(v)  ||
                      //date
                        /^new Date\([0-9 \,]*\)$/i.test(v)  ||
                      //function
                        /^((function\s*([\w$]+\s*)?\(\s*([\w$\s,]*)\s*\)\s*)(\{([^\{\}]*)\}))$/i.test(v)  ||
                      //hash
                        /^\{[\s\S]*\}$/.test(v)  ||
                      //array
                        /^\[[\s\S]*\]$/.test(v)  );
        },
        _tg_beforecellupdated:function (profile, cell, options) {
            var map={'hash':1,'array':2},
                row=cell._row,
                rowId=row.id,
                tg=profile.boxing();
            if(cell._col.id=='value'){
                var  va=this._getCellValue(options.value);
                if(!va){
                    alert('Text format is not valid!');
                    return false;
                }else{
                    var ops={};
                    options.value=va[1];
                    
                    if(map[va[0]]){
                        ops.sub=this._json2rows(xui.unserialize(va[1]),va[0]=='array');
                        options.caption=va[0]=='hash'?'{...}':'[...]';
                    }else{
                        ops.sub=null;
                    }
                    xui.asyRun(function(){
                        tg.updateRow(rowId, ops);
                        // must get
                        row = tg.getRowbyRowId(rowId);
                        row._type=va[0];
                    },100);
                }
            }else{
                if(!/^"(\\.|[^"\\])*"$/.test('"'+options.value+'"')){
                    alert('Text format is not valid!');
                    return false;
                }
            }
        },
        _tg_oncmd:function (profile, row, cmdkey, e, src){
            var ns = this, 
                tg = profile.boxing(),
                type = row ? row._type : ns._rootArr ? 'array': 'hash',
                ptype, prow, nid;

            if(row && row._pid) {
                prow = profile.rowMap[row._pid];
                ptype = prow&&prow._type;
            }else{
                prow = {sub:profile.properties.rows};
                ptype = ns._rootArr ? 'array': 'hash';
            }
            switch(cmdkey){
                case 'add': 
                    nid=xui.stamp();
                    if(row){
                        if(type=="array"||type=="hash"){
                            tg.insertRows([{id:nid, cells:[{value:type=='array'?'[index]':xui.rand(),readonly:type=='array'},'null','']}],row.id);
                        }else{
                            var id=row.id;
                            xui.confirm("Hash or Array", "Modify this node as an Hash or Array?",function(){
                                tg.updateCellByRowCol(id, "value", "{"+xui.rand()+":"+row.cells[1].value+"}", false, true);
                                xui.asyRun(function(){
                                    tg.editCellbyRowCol(id, "value");
                                },200);
                            },function(type){
                                if(type=='close')return;
                                var id=row.id;
                                tg.updateCellByRowCol(id, "value", "["+row.cells[1].value+"]", false, true);
                                xui.asyRun(function(){
                                    tg.editCellbyRowCol(id,"value");
                                },200);
                            },'As a Hash','As an Array')
                        }
                    }else{
                        tg.insertRows([{id:nid, cells:[{value:type=='array'?'[index]':xui.rand(),readonly:type=='array'},'null','']}]);
                    }
                    break;
                case 'up': 
                     nid=xui.stamp();
                    tg.insertRows([{id:nid, cells:[{value:ptype=='array'?'[index]':xui.rand(),readonly:ptype=='array'},'null','']}],null,row.id,true);
                    break;
                case 'down':
                     nid=xui.stamp();
                    tg.insertRows([{id:nid, cells:[{value:ptype=='array'?'[index]':xui.rand(),readonly:ptype=='array'},'null','']}],null,row.id,false);
                    break;
                case 'del': 
                   // xui.confirm('confirm','Do you want to delete this node?',function(){
                          tg.removeRows([row.id]);
                  //  });
                    break;
            }
            if(row && type=='array'){
                // re index for array
                xui.arr.each(row.sub, function(row, i){
                    var cell=row.cells[0];
                    profile.boxing().updateCell(cell, {caption:'['+i+']'});
                });
            }
            else if(prow && ptype=='array'){
                // re index for array
                xui.arr.each(prow.sub, function(row, i){
                    var cell=row.cells[0];
                    profile.boxing().updateCell(cell, {caption:'['+i+']'});
                });
            }
            if( nid )
                xui.asyRun(function(){
                    tg.editCellbyRowCol(nid+'', ptype=='array'?"value":"key");
                });
        }
    }
});