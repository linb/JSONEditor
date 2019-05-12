xui.Class('App', 'xui.Module',{
    Instance:{
        events:{"beforeCreated":"_beforeCreated", "afterIniComponents":"_afterinicomponents"},

        sampleCode:'{"name":"JSON Editor","powered by":"CrossUI","version":"1.0","test data":{"int":23,"float":23.23,"string":"This\'s a string.","html":"<div>a<span>c</span>b</div>","hash":{"a":1,"b":"2"},"array":[1,"2",3],"regexp":/^{[w]*}$/gim,"NULL":null,"Date":new Date(1998,10,20,4,23,14,120),"function":function (a,b,c){return a+b+c;}}}',
        iniComponents:function(){
            // [[Code created by CrossUI RAD Tools
            var host=this, children=[], append=function(child){children.push(child.get(0))};

            append((new xui.UI.Image)
                .setHost(host,"image2")
                .setTop("2")
                .setRight("18")
                .setZIndex("100")
                .setSrc("img/logo.gif")
            );

            append((new xui.UI.ToolBar)
                .setHost(host,"toolbar")
                .setItems([{"id":"group1", "sub":[{"id":"sample", "caption":"Insert Sample Code"}, {"id":"format", "caption":"Format Code"}, {"id":"compress", "caption":"Compress Code"}, {"id":"totreegrid", "caption":"goto TreeView"}], "caption":"group1"}, {"id":"group2", hidden:true, "sub":[{"id":"tocode", "caption":"goto CodeView"}], "caption":"group1"}])
                .onClick("_toolbar_onclick")
            );

            return children;
            // ]]Code created by CrossUI RAD Tools
        },
        _beforeCreated:function () {
            SPA=this;
        },
        _onrender:function(){
        },
        toCodeView:function(){
            var n2=SPA.$cv.getRoot(),
                n1=SPA.$tv.getRoot(),
                region=n1.cssRegion(),
                region2=xui.copy(region),
                w=region.width;
            
            SPA.$cvhost.setValue(xui.Coder.formatText(SPA.$tvhost.getValue()));

            region2.left=w;
            n2.css('display','').cssRegion(region2);
            n1.animate({move:function(rate){
                    n1.left(-rate*w);
                    n2.left((1-rate)*w);
                }},xui.fun(),function(){
                n2.cssRegion(region);
                n1.css('display','none');

                SPA.$cv.reLayout(true);

                SPA.toolbar.showGroup('group1',true);
                SPA.toolbar.showGroup('group2',false);
                
            },200,20,'expoOut').start();
        },
        toTreeView:function(){
            var str=SPA.$cvhost.getValue();
            if(!SPA.eval2(str))return;

            SPA.$tvhost.setValue(xui.Coder.formatText(str));

            var n1=SPA.$cv.getRoot(),
                n2=SPA.$tv.getRoot(),
                region=n1.cssRegion(),
                region2=xui.copy(region),
                w=region.width;
            region2.left=-w;
            n2.css('display','').cssRegion(region2);
            n1.animate({move:function(rate){
                    n1.left(rate*w);
                    n2.left((rate-1)*w);
                }},xui.fun(),function(){
                n2.cssRegion(region);
                n1.css('display','none');

                SPA.$tv.reLayout(true);

                SPA.toolbar.showGroup('group2',true);
                SPA.toolbar.showGroup('group1',false);
            },200,20,'expoOut').start();

        },
        _afterinicomponents:function () {
            var cf=xui.ComFactory;
            cf.setProfile({
                codeview:{
                    cls:'App.CodeView'
                },
                treeview:{
                    cls:'App.TreeView'
                }
            });
            cf.getCom('codeview',function(){
                if(!SPA.$cv){
                    SPA.$cvhost=this;
                    SPA.$cv=this.getUIComponents();
                    SPA.$cv.setZIndex(2);
                    xui(document.body).append(SPA.$cv);
                }
            });
            cf.getCom('treeview',function(){
                if(!SPA.$tv){
                    SPA.$tvhost=this;
                    SPA.$tv=this.getUIComponents();
                    SPA.$tv.setZIndex(1);
                    xui(document.body).append(SPA.$tv);
                }
            });
        },
        _toolbar_onclick:function (profile, item, group, e, src) {
            if(group.id=='group1'){
                var str=SPA.$cvhost.getValue();
                switch(item.id){
                    case 'sample':
                        SPA.$cvhost.setValue(SPA.sampleCode,true);
                        break;
                    case 'format':
                        if(SPA.eval2(str)){
                            SPA.$cvhost.setValue(xui.Coder.formatText(str),true);
                        }
                        break;
                    case 'compress':
                        if(SPA.eval2(str)){
                            SPA.$cvhost.setValue(xui.Coder.formatText(str,'js',true),true);
                        }
                        break;
                    case 'totreegrid':
                        SPA.toTreeView();
                        break;
                }
            }else{
                switch(item.id){
                    case 'tocode':
                    SPA.toCodeView();
                    break;
                }
            }
            
        },
        eval2:function(txt){
            if(typeof txt!='string' || !txt){
                alert('No conent!');
                return false;
            }
            var r=true,
                iframe = document.createElement("iframe");
            iframe.style.display = "none";
            document.body.appendChild(iframe);
            frames[frames.length - 1].document.write(
                "<script>"+
                "var MSIE/*@cc_on =1@*/;"+
                "parent.sandbox=MSIE?this:{eval:function(s){return eval(s)}}"+
                "<\/script>"
            );
            txt=xui.str.trim(txt);
            try{
                var reg = new RegExp("^(\\s*\\/\\*[^*@]*\\*+([^\\/][^*]*\\*+)*\\/\\s*)|^(\\s*\\/\\/[^\\n]*\\s*)");
                var str=txt;
                while(reg.test(str))
                    str = str.replace(reg,'');
                var isjson=/^\s*(\{|\[|function)/.test(str);

                sandbox.eval(isjson?("("+txt+")"):txt);
            }catch(e){
                var line=e.line||e.lineNumber;
                alert((e.name?e.name+' : ':'') + (e.description||e.message||'') + (line?'\n line : '+line:'') );
                r=false;
            }finally{
                document.body.removeChild(iframe);
            }
            return r;
        },
        onCmdClick:function(btn){
            SPA.$tvhost.onCmdClick(btn);
        }
    }
});