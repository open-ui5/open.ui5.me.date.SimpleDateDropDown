jQuery.sap.declare("open.ui5.me.date.SimpleDateDropDown");
jQuery.sap.require("sap.m.Input");
jQuery.sap.require("sap.m.Select");
jQuery.sap.require("sap.m.HBox");
sap.ui.core.Control.extend("open.ui5.me.date.SimpleDateDropDown", {
    metadata : {
    	library : "open.ui5.me.date",
        properties : {
            "day" :      {type : "string"},
            "month" :    {type : "string"},
            "year":      {type : "string"},
            "startYear": {type : "string", defaultValue : "1900"},
            "endYear":   {type : "string"},
            "pattern":   {type : "string", defaultValue : "ddmmYYYY"}
        },
    },

    init: function() {
    	var id = this.getId() + "-SimpleDateDropDownDay";
    	this._day = new sap.m.Select(id,{width:"70px"});
       	this._day.attachChange(null, function(evt){
          	 var iDay= evt.getSource().getSelectedKey();
          	 this._updateDays(iDay, this.getMonth(), this.getYear());
          	 this.invalidate();
          	}, this);
    	
    	id = this.getId() + "-SimpleDateDropDownMonth";
       	this._month = new sap.m.Select(id,{width:"70px"});
       	this._month.attachChange(null, function(evt){
       	 var iMonth= evt.getSource().getSelectedKey();
       	 this._updateMonth(this.getDay(), iMonth, this.getYear());
       	 this.invalidate();
       	}, this);
       	id = this.getId() + "-SimpleDateDropDownYear";
       	this._year = new sap.m.Select(id,{width:"100px"});
       	this._year.attachChange(null, function(evt){
          	 var iYear= evt.getSource().getSelectedKey();
          	 this._updateYear(this.getDay(), this.getMonth(),  iYear);
          	 this.invalidate();
          	}, this);
       	
       	
       	id = this.getId() + "-SimpleDateDropDownControl";
        this._Hbox = new sap.m.HBox(id);
        this._fillMonth();
        this._fillYear();
    },
    
    

    _updateDays: function(iDay,iMonth,iYear)
    {  
    	
    	var oDay   = iDay   || this.getDay() || "31";
    	var oMonth = iMonth || this.getMonth() || "2";
    	var oYear  = iYear  || this.getYear() || "1970";

       	this.setDay(oDay);
    	var dt = new Date(oYear,+oMonth-1,oDay);
    	var nDay = dt.getDate();
    	
    	if (+oDay != +nDay)
    	{
    		dt.setDate(1);
    		dt = new Date(dt - 1);
    		nDay = dt.getDate();
    		this.setDay(nDay);
    	}

   		dt.setDate(1);    	
		dt.setMonth(oMonth);
		dt = new Date(dt - 1);
		var pDay = dt.getDate();
    	
        this._fillDays(pDay);
        this.setDay(nDay);
    	this._day.setSelectedKey(nDay);
    	
    	return;
    },
    
    _fillDays: function(mDay)
    {  
		var model = new sap.ui.model.json.JSONModel();
		var data = new Object();
		
		data.days =  new Array();
		for (var i = 1; i <= mDay; i++) {
			var obj = new Object();
			obj.key = ""+i;
			obj.value = ""+i;
			data.days.push(obj);
		} 
        
		model.setData(data);
		
		this._day.setModel(model);
		var id = "SimpleDateDropDownDayItem";
		if (sap.ui.getCore().byId(id))
		{
			sap.ui.getCore().byId(id).destroy();
		}

		this._day.bindAggregation("items", "/days", new sap.ui.core.Item( {  
            key: "{key}",
            text: "{value}"  
         }));
    },
    
    _updateMonth: function(iDay,iMonth,iYear)
    {  
    	
    	var oDay   = iDay   || this.getDay()   || "31";
    	var oMonth = iMonth || this.getMonth() || "2";
    	var oYear  = iYear  || this.getYear()  || "1970";
      	this.setMonth(oMonth);
   		this._updateDays(oDay, oMonth, oYear);
    	this._month.setSelectedKey(oMonth);
    },
    	
    
    _fillMonth: function()
    {  
		var model = new sap.ui.model.json.JSONModel();
		var data = new Object();
		
		data.month =  new Array();
		for (var i = 1; i <= 12; i++) {
			var obj = new Object();
			obj.key = ""+i;
			obj.value = ""+i;
			data.month.push(obj);
		} 
        
		model.setData(data);
		this._month.setModel(model);
		var id = this.getId() + "-SimpleDateDropDownMonthItem";

		this._month.bindAggregation("items", "/month", new sap.ui.core.Item(id, {  
            key: "{key}",
            text: "{value}"  
         }));
    	
    	return;
    },

  
    _updateYear: function(iDay,iMonth,iYear)
    {  
    	
    	var oDay   = iDay   || this.getDay()   || "31";
    	var oMonth = iMonth || this.getMonth() || "2";
    	var oYear  = iYear  || this.getYear()  || "1970";
    	if (oYear != this.getYear())
    	{
    		this.setYear(oYear);
       		this._updateDays(oDay, oMonth, oYear);
        	this._year.setSelectedKey(oYear);	
    	}
    },
    	
    
    _fillYear: function(iStartYear,iEndYear)
    {  
    	var oStartYear = iStartYear  || this.getStartYear() || "1900";
    	var oEndYear   = iEndYear    || this.getEndYear()   ||  (new Date()).getFullYear().toString();
    	
    	
		var model = new sap.ui.model.json.JSONModel();
		var data = new Object();
		
		data.year =  new Array();
		for (var i = oEndYear; i >= oStartYear; i--) {
			var obj = new Object();
			obj.key = ""+i;
			obj.value = ""+i ;
			data.year.push(obj);
		} 
        
		model.setData(data);
		this._year.setModel(model);
		var id = this.getId() + "-SimpleDateDropDownYearItem";

		this._year.bindAggregation("items", "/year", new sap.ui.core.Item(id, {  
            key: "{key}",
            text: "{value}"  
         }));
    	
    	return;
    },
    
    _setDateControl: function()
    {
    	
    	this._Hbox.removeAllItems();
    	switch (this.getPattern()) {
		case "ddmmYYYY":
			this._Hbox.addItem(this._day);
			this._Hbox.addItem(this._month);
			this._Hbox.addItem(this._year);
			break;
		default:
			break;
		}
    	return;
    	
    }, 
    
    
    renderer : function(oRm, oControl) {
        oRm.write("<div"); 
        oRm.writeControlData(oControl);
        oRm.addClass("SimpleDateDropDown"); 
        oRm.writeClasses();
        oRm.write(">");        
        oControl._updateDays();
        oControl._updateMonth();
        oControl._updateYear();
        oControl._setDateControl();
        oRm.renderControl(oControl._Hbox);
        oRm.write("</div>");
    }
});