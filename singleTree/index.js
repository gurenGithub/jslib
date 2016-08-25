

function xSingleTree(){

   this.opts={}
   this.$container=null;

  	var els={
		$xSingleTree:null,
		$xSelected:null,
		$content:null,
		$ul:null
	}
	this.selecteds=[];
}

xSingleTree.prototype.init=function(){

	var _data=this.opts.data;
	var _field=this.opts.field;
	var _displayField=this.opts.displayField;
	var _parentField=this.opts.parentField;
	var _isMulti=this.opts.isMulti;
	var _parents=this.opts.selecteds;
	if(this.opts.onChange){
		this.onChange=this.opts.onChange;
	}
}
xSingleTree.prototype.render = function(opts,containerId)
{
	
	this.opts=opts;
	this.$container= document.getElementById(containerId);
	this.init();
	var _parentDefaltValue=opts.defaltValue || null;


     this.renderLayout();
     this.setValue(this.opts.value);
    //  this.renderItem( this.getParentData(_parentDefaltValue))
     
};

xSingleTree.prototype.renderLayout=function(){


	var els={
		$xSingleTree:null,
		$xSelected:null,
		$content:null,
		$ul:null,
		$init:null
	}
	els.$xSingleTree=document.createElement('div');

	els.$xSingleTree.className='xSingleTree';
	els.$xSelected=document.createElement('div');
	els.$xSelected.className='selected';
    els.$ul=document.createElement('ul');
    els.$xSelected.appendChild( els.$ul)
    els.$xSingleTree.appendChild(els.$xSelected);
	els.$content=document.createElement('div');
	els.$content.className='content';
	els.$xSingleTree.appendChild(els.$content);
	this.$container.appendChild(els.$xSingleTree);

	els.$init=document.createElement('span');
	els.$init.className='init';
	els.$xSingleTree.appendChild( els.$init);

    var me=this;
	xUtils.addEvent(els.$init,'click',function(){
      
      for(var item in me.opts.value){
      	 me.opts.value[item]=null;
      }
      me.selecteds.length=0;
      me.setValue(me.opts.value)
	})
	this.els=els;

}

xSingleTree.prototype.selecteds=[];
xSingleTree.prototype.get$Select=function(){
 
 return this.els.$xSelected;

}
xSingleTree.prototype.get$Content=function(){

 return this.els.$content;
}

xSingleTree.prototype.setActive=function($li,isLastItem){

	 var $lis=this.els.$ul.children;
        var currentIndex=0;
          for (var k = $lis.length - 1; k >= 0; k--)
          {
          	  var _$li=$lis[k];
          	  if(_$li==$li){
          	  	$li.className=isLastItem?'active activeLast':'active';
          	  	currentIndex=k;

          	  	continue
          	  }
          	  if(k>currentIndex){
                this.els.$ul.removeChild(_$li);
                this.selecteds.splice(k,1);
          	  }else{
                _$li.className="";
              }
          }

          this.initValue();
}

xSingleTree.prototype.initValue=function(){
var value=this.opts.value;
if(!value){
	return ;
}
var texts=[];
var i=0;
  for(var item in value){
  	    var _value = this.selecteds && (this.selecteds.length-1)>=i ? this.getItemValue(this.selecteds[i]) :null;
  	    var _text = this.selecteds && (this.selecteds.length-1)>=i ? this.getItemText(this.selecteds[i]) :null;
  	    if(_text){
          texts.push(_text);
  	    }
        this.opts.value[item]= _value;
        i++;
  }
  this.opts.text=texts.join(' ');
  this.onChange(this.opts.value,this.opts.text);
}

xSingleTree.prototype.addLi=function($li,parent){


var me=this;
	 (function($li,parent){
            
          xUtils.addEvent($li,'click',function(e)
          {
              var className=this.className;
                      if(className.indexOf('active')>-1){
                      	 return;
                      }

      	    	  	  me.renderItem(parent,$li);

      	    	  })
         })($li,parent);
}
xSingleTree.prototype.renderItem=function(parent,liItem)
{
      var childs =this.getChildData(this.getItemValue(parent));
      var me=this;
      var $ul=this.get$Ul();
      var $li=null;
      if(liItem){
      	 $li =liItem;
      }else{
       $li=document.createElement('li');
      var _text= this.getItemText(parent);
      $li.innerHTML=_text;
      $ul.appendChild($li);
      this.selecteds.push(parent);
      this.addLi($li,parent);
  }

     this.setActive($li,childs.length==0);
     this.renderContentItems(childs);
     return  (childs && childs.length>=0)?true:false;
}

xSingleTree.prototype.renderContentItems=function(childs){
	var me=this;
	this.els.$content.innerHTML="";
	 for (var i = childs.length - 1; i >= 0; i--) {
      	   
      	    (function(i){
      	    	var child = childs[i];

      	    	var $child=me.renderContentItem(child);
      	    	  xUtils.addEvent($child,'click',function(e){
      	    	  	    var hasChild= me.renderItem(child);
      	    	  	    
      	    	  })
                   me.els.$content.appendChild($child);
      	    })(i) 
      }
}
xSingleTree.prototype.renderContentItem=function(child){

     var $child=document.createElement('span');
     $child.innerHTML= this.getItemText(child);
     return $child;
}
xSingleTree.prototype.get$Ul=function(){
	return this.els.$ul;
}
xSingleTree.prototype.getItemText=function(value){

return value[this.opts.displayField || 'text'];
}
xSingleTree.prototype.getItemValue=function(value){

return value[this.opts.valueField || 'value'];
}

xSingleTree.prototype.getItemParentValue=function(value){

return value[this.opts.parentField || 'parentId'];
}
xSingleTree.prototype.getParentData=function(value){
    if(!this.opts || !this.opts.data || this.opts.data.length==0){
    	return {};
    }
	for (var i = this.opts.data.length - 1; i >= 0; i--) {
		var _item=this.opts.data[i];
		var _value=this.getItemParentValue(_item);
		if(_value!=value){ continue;}
		return _item;
	}
	return {};
}
xSingleTree.prototype.getChildData=function(parentValue)
{
     var childs=[];
    if(!this.opts || !this.opts.data || this.opts.data.length==0){
    	return childs;
    }
	for (var i = this.opts.data.length - 1; i >= 0; i--) {
		
		var _item=this.opts.data[i];
		var _value=_item[this.opts.parentField];
		if(_value!=parentValue){ continue;}
		childs.push(_item);
	}
	return childs;
}
xSingleTree.prototype.getSelecteds=function(){


}
xSingleTree.prototype.onChange=function(){


}
xSingleTree.prototype.getItem=function(value){

	if(!this.opts || !this.opts.data || this.opts.data.length==0){
    	return childs;
    }
	for (var i = this.opts.data.length - 1; i >= 0; i--) {
		
		var _item=this.opts.data[i];
		var _value=_item[this.opts.valueField];
		if(_value!=value){ continue;}
		
		return _item;
	}
	return null;
}

xSingleTree.prototype.setValue=function(value)
{

     this.els.$ul.innerHTML=""



	for(var item  in value){
		this.opts.value[item]=value[item];
	}

	//创建Li和一个Content

	for(var item  in this.opts.value){
		var _value=this.opts.value[item];
         var _item=this.getItem(_value);
         if(_item!=null){
         	this.selecteds.push(_item);
         }
	}

    var $ul=this.get$Ul();
    if(this.selecteds && this.selecteds.length>0){
	for (var k = 0; k < this.selecteds.length ; k++) 
	{
		var selectedItem=this.selecteds[k];
		if(k==this.selecteds.length - 1){
             this.renderItem(selectedItem)
			return ;
		}
        $li=document.createElement('li');
        var _text= this.getItemText(selectedItem);
        $li.innerHTML=_text;
        $ul.appendChild($li);
        this.addLi($li,selectedItem);
	}
  }else{


  	var parents=this.getChildData(null);
    this.renderContentItems(parents);
  }

}