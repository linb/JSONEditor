xui.Class('App.CodeView', 'xui.Module',{
    Instance:{
        events:{onReady:'_onready'},
        _onready:function(){
            this.texteditor.setValue(xui.Coder.formatText(SPA.sampleCode),true);
        },
        iniComponents:function(){
            // [[Code created by CrossUI RAD Tools
            var host=this, children=[], append=function(child){children.push(child.get(0))};

            append((new xui.UI.Layout)
                .setHost(host,"layout6")
                .setItems([{"id":"main", "min":10, "caption":"main"}, {"id":"after", "pos":"after", "size":30, "locked":true, "min":10, "folded":false, "cmd":false, "caption":"after"}])
                .setLeft(0)
                .setTop(0)
                .setType("horizontal")
            );

            host.layout6.append((new xui.UI.Input)
                .setHost(host,"texteditor")
                .setMultiLines(true)
                .setDock("fill")
                .setLeft(380)
                .setTop(190)
            , 'main');

            host.layout6.append((new xui.UI.Button)
                .setHost(host,"button25")
                .setDock("fill")
                .setLeft(20)
                .setTop(110)
                .setCaption(">")
                .setVAlign("middle")
                .onClick("_button25_onclick")
                .setCustomStyle({KEY:'background:#eee;'})
            , 'after');

            return children;
            // ]]Code created by CrossUI RAD Tools
        },
        _button25_onclick:function (profile, e, src, value) {
            SPA.toTreeView()
        },
        setValue:function(str){
            var ns=this;
            ns.$code=str;
            ns.texteditor.setValue(str,true);
        },
        getValue:function(){
            return this.texteditor.getUIValue();
        }
    }
});