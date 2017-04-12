var Methods = {

    GetTemplate: "GetTemplate",
    GetModule: "GetModule",
    RemoveModule: "RemoveModule"

};

var xPostDataFields = {
    Bounds: "Bounds",
    Condictions: "Condictions",
    ZoomLevel: "ZoomLevel",
    IsClearCache: "IsClearCache",
    IgnoreBounds: "IgnoreBounds",
    PageSize: "PageSize",
    MapBounds: "MapBounds",
    PixelDistance: "PixelDistance"
};
function xEntity() {
    this.entity = {};
}
xEntity.prototype.setField = function (name, value) {
    this.entity[name] = value;
}
xEntity.prototype.getField = function (name) {

    return this.entity[name];
}
xEntity.prototype.getEntity = function () {

    return this.entity;
}

function xPostData(){
   
    this.entity = {};
}
xPostData.prototype = new xEntity();
xPostData.prototype.getCondictions = function () {
    return this.getField("Condictions");
}
xPostData.prototype.setCondictions = function (value) {
    this.getField("Condictions", value);
}
xPostData.prototype.getZoomLevel = function () {
    return this.getField("ZoomLevel");
}
xPostData.prototype.setZoomLevel = function (value) {
    this.getField("ZoomLevel", value);
}
xPostData.prototype.getClearCache = function () {
    return this.getField("IsClearCache");
}
xPostData.prototype.setClearCache = function (value) {
    this.getField("IsClearCache", value);
}
xPostData.prototype.getInoreBounds = function () {
    return this.getField("IgnoreBounds");
}
xPostData.prototype.setIgnoreBounds = function (value) {
    this.getField("IgnoreBounds", value);
}
xPostData.prototype.getMapBounds = function () {
    return this.getField("MapBounds");
}
xPostData.prototype.setMapBounds = function (value) {
    this.getField("MapBounds", value);
}
xPostData.prototype.getPixelDistance = function () {
    return this.getField("PixelDistance");
}
xPostData.prototype.setPixelDistance = function (value) {
    this.getField("PixelDistance", value);
}
xPostData.prototype.Overlay = {
    Type: null,
    Points: [],
    Bounds: {}
}
xPostData.prototype.SetOverlay = function (type, points, bounds) {
    this.Overlay.Type = type;
    this.Overlay.Points = points;
    this.Overlay.Bounds = bounds;
    this.setField("Overlay",this.Overlay);
}
xPostData.prototype.GetOverlay = function () {
    return this.getField("Overlay");
}
function xModule() {
    this.entity = {};
    this.data = [];
}

xModule.prototype = {
    setAjaxUrl: function (url) {
        this.entity["url"] = url;
    },
    getAjaxUrl: function () {
        return this.entity["url"];
    },
    setPostData: function (postData) {
        this.entity["postData"] = postData;
    },
    getPostData: function () {
        return this.entity["postData"];
    },
    getAutoAjax: function () {
        return this.entity["isAutoAjax"];
    },
    setAutoAjax: function (isAutoAjax) {
        return this.entity["isAutoAjax"];
    },
    setName: function (name) {
        return this.entity["name"] = name;
    },
    getName: function () {
        return this.entity["name"];
    },

    set: function (data) {
        this.entity["data"] = data;
    },
    filter: function (onFilterAction, onMatching) {
        this.each(function (data) {
            if (onFilterAction(data)) {

                onMatching(data);
            }
        });

    },
    remove: function (onFilter) {
        for (var i = 0; i < this.get().length; i++) {
            var data = this.get()[i];
            if (onFilter(data)) {
                this.get().splice(i, 1);
                i--;
            }
        }
    },
    clear: function () {
        this.get().length = 0;
    },
    each: function (onAction) {
        for (var i = 0; i < this.get().length; i++) {

            var data = this.get()[i];
            onAction(data);
        }
    },
    get: function () {
        return this.entity["data"];
    }
}

function xMap() {

}
xMap.prototype.
xMap.prototype[Methods.GetTemplate] = function (
                                                         moduleName,
                                                          url,
                                                          searchExpress,
                                                          onAjaxSuccess,
                                                          onAddOverlayCompleted,
                                                          onAddOverlayBefore,
                                                          onAjaxBefore)
{

}
