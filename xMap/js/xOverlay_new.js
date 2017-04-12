
var Methods = {

    GetTemplate: "GetTemplate"

};

/*
JSON字段
*/
var xFields = (function (xFields) {

    
    var xfields = {
        Lat: "lat",
        Lng: "lng",
        Name: "name",
        Polygons: "polygons",
        Polylines: "polygons",
        Attributes: "attributes",
        Points: "points",
        Point:"point",
        InnerRings: "innerRings",
        Tmpls: "tmpls",
        Width: "width",
        Height:"height",
        Posiction: "posiction",
        Rdius: "radius",
        OverlayType: "overlayType"

    };

    return xfields;
})()


var xUtility = (function () {


    var p1, p2, p3, p4;
    var methods = {
        isPointInCircle: function (point, x, y, radius) {
            //point与圆心距离小于圆形半径，则点在圆内，否则在圆外
            var c = { lat: y, lng: x };
            var r = radius;
            var dis = this.getDistance(new BMap.Point(point.lng, point.lat), new BMap.Point(c.lng, c.lat));
            if (dis <= r) {
                return true;
            }
            else {
                return false;
            }
        },
        getDistance: function (point1, point2) {
            return BMapLib.GeoUtils.getDistance(point1, point2);
        },
        /*
      获取到PX距离
      */
        getPixelDistance: function (map) {
            var x = 10, y = 10, x1 = 11, y1 = 10;
            var p = new BMap.Pixel(x, y);
            var point = map.pixelToPoint(p)
            var p1 = new BMap.Pixel(x1, y1);
            var point1 = map.pixelToPoint(p1);
            return this.getDistance(point, point1);
        },
        /*判断点是否在矩形内
        @point 当前点
        @southWestPoint 右上角点
        @northEastPoint 左下角点
        */
        isPointInRect: function (point, southWestPoint, northEastPoint) {

            var sw = southWestPoint;//西南脚点
            var ne = northEastPoint; //东北脚点
            return (point.lng >= sw.lng && point.lng <= ne.lng && point.lat >= sw.lat && point.lat <= ne.lat);
        },
        isPointInPolygon: function (point, polygonPoints) {
            //下述代码来源：http://paulbourke.net/geometry/insidepoly/，进行了部分修改
            //基本思想是利用射线法，计算射线与多边形各边的交点，如果是偶数，则点在多边形外，否则
            //在多边形内。还会考虑一些特殊情况，如点在多边形顶点上，点在多边形边上等特殊情况。
            var pts = polygonPoints;
            var N = polygonPoints.length;
            var boundOrVertex = true; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
            var intersectCount = 0;//cross points count of lng
            var precision = (2e-10); //浮点类型计算时候与0比较时候的容差
            var p1, p2;//neighbour bound vertices
            var p = point; //测试点

            p1 = pts[0];//left vertex        
            for (var i = 1; i <= N; ++i) {//check all rays            
                if (p.equals(p1)) {
                    return boundOrVertex;//p is an vertex
                }

                p2 = pts[i % N];//right vertex            
                if (p.lat < Math.min(p1.lat, p2.lat) || p.lat > Math.max(p1.lat, p2.lat)) {//ray is outside of our interests                
                    p1 = p2;
                    continue;//next ray left point
                }

                if (p.lat > Math.min(p1.lat, p2.lat) && p.lat < Math.max(p1.lat, p2.lat)) {//ray is crossing over by the algorithm (common part of)
                    if (p.lng <= Math.max(p1.lng, p2.lng)) {//lngis before of ray                    
                        if (p1.lat == p2.lat && p.lng >= Math.min(p1.lng, p2.lng)) {//overlies on a horizontal ray
                            return boundOrVertex;
                        }

                        if (p1.lng == p2.lng) {//ray is vertical                        
                            if (p1.lng == p.lng) {//overlies on a vertical ray
                                return boundOrVertex;
                            }
                            else {//before ray
                                ++intersectCount;
                            }
                        }
                        else {//cross point on the left side                        
                            var xinters = (p.lat - p1.lat) * (p2.lng - p1.lng) / (p2.lat - p1.lat) + p1.lng;//cross point of lng                        
                            if (Math.abs(p.lng - xinters) < precision) {//overlies on a ray
                                return boundOrVertex;
                            }

                            if (p.lng < xinters) {//before ray
                                ++intersectCount;
                            }
                        }
                    }
                }
                else {//special case when ray is crossing through the vertex                
                    if (p.lat == p2.lat && p.lng <= p2.lng) {//p crossing over p2                    
                        var p3 = pts[(i + 1) % N]; //next vertex                    
                        if (p.lat >= Math.min(p1.lat, p3.lat) && p.lat <= Math.max(p1.lat, p3.lat)) {//p.lat lies between p1.lat & p3.lat
                            ++intersectCount;
                        }
                        else {
                            intersectCount += 2;
                        }
                    }
                }
                p1 = p2;//next ray left point
            }

            if (intersectCount % 2 == 0) {//偶数在多边形外
                return false;
            }
            else { //奇数在多边形内
                return true;
            }
        },
        getBoundsForPoints: function (points) {

            var me = this;
            var lngs = new Array();
            var lats = new Array();
            for (var i = 0; i < points.length; i++) {
                var point = points[i];
                lngs.push(point.lng);
                lats.push(point.lat);
            }
            var minLng = this.getMin(lngs);
            var maxLng = this.getMax(lngs);
            var minLat = this.getMin(lats);
            var maxLat = this.getMax(lats);
            var point1 = { lng: maxLng, lat: maxLat };
            var point2 = { lng: minLng, lat: minLat };
            var tmpl = {};
            tmpl.northEastLng = point1.lng;
            tmpl.northEastLat = point1.lat;
            tmpl.southWestLng = point2.lng;
            tmpl.southWestLat = point2.lat;
            return tmpl;
        },
        isPointInPolyline: function (point, points) {
            return BMapLib.GeoUtils.IsPointOnPolyline(point, points)
        },
        getMin: function (array) {

            var min = Number.MAX_VALUE;
            for (var i = 0; i < array.length; i++) {
                if (min > array[i]) {
                    min = array[i];
                }
            }
            return min;
        },

        getMax: function (array) {
            var max = Number.MIN_VALUE;
            for (var i = 0; i < array.length; i++) {
                if (max < array[i]) {
                    max = array[i];
                }
            }
            return max;
        },
        // 判断点在有向直线的左侧还是右侧.
        // 返回值:-1: 点在线段左侧; 0: 点在线段上; 1: 点在线段右侧
        pointAtLineLeftRight: function (ptStart, ptEnd, ptTest) {
          
            p1 = { lng: ptStart.lng, lat: ptStart.lat }; 
            p2 = { lng: ptEnd.lng, lat: ptEnd.lat };
            p3 = { lng: ptTest.lng, lat: ptTest.lat };
            p1.lng -= p3.lng;
            p1.lat -= p3.lat;
            p2.lng -= p3.lng;
            p2.lat -= p3.lat;
            var nRet = (p1.lng * p2.lat - p1.lat * p2.lng);
            if (nRet == 0)
                return 0;
            else if (nRet > 0)
                return 1;
            else if (nRet < 0)
                return -1;

            return 0;
        },
        // 判断两条线段是否相交
        isLineIntersect: function (ptLine1Start, ptLine1End, ptLine2Start, ptLine2End) {
            var nLine1Start = this.pointAtLineLeftRight(ptLine2Start, ptLine2End, ptLine1Start);
            var nLine1End = this.pointAtLineLeftRight(ptLine2Start, ptLine2End, ptLine1End);
            if (nLine1Start * nLine1End > 0)
                return false;

            var nLine2Start = this.pointAtLineLeftRight(ptLine1Start, ptLine1End, ptLine2Start);
            var nLine2End = this.pointAtLineLeftRight(ptLine1Start, ptLine1End, ptLine2End);

            if (nLine2Start * nLine2End > 0)
                return true;

            return true;
        },
        convertToBMapPoint: function (point) {
            if (point instanceof BMap.Point) {

                return point;
            }
            return point= new BMap.Point(point.lng, point.lat);
        },
        /// <summary>
        /// 面与面相交是否相交
        /// </summary>
        /// <param name="linePoints">线点对象</param>
        /// <param name="polygonPoints">图形点对象</param>
        /// <returns></returns>
        isLinesInBounds: function (linePoints, polygonPoints) {
            for (var i = 0; i < polygonPoints.length - 2; i++) {
                for (var j = 0; j < linePoints.length - 2; j++) {
                 
                    if(this.isPointInPolygon(this.convertToBMapPoint( linePoints[j]),polygonPoints)){
                        return true;
                    }
                    if (this.isLineIntersect(linePoints[j], linePoints[j + 1], polygonPoints[i], polygonPoints[i + 1])) {
                        return true;
                    }
                }

            }
        },
        getBoundPoints: function (northEastBounds, southWestBounds) { //返回四个对角坐标信息【左上角，右上角，左下角，右下角】
            var point1 = { lng: northEastBounds.lng, lat: southWestBounds.lat };//左上角
            var point2 = northEastBounds; //右上角
            var point3 = { lng: southWestBounds.lng, lat: northEastBounds.lat };//左下角
            var point4 = southWestBounds; //右下角
            return [this.convertToBMapPoint( point1), this.convertToBMapPoint( point2),this.convertToBMapPoint( point3), this.convertToBMapPoint( point4)];
        }
    }

    return methods;
} )();
var xOverlay = (function (xoverlay) {

    var _x1, _y1, _x2, _y2,_p1, _p2, _p3, _p4;
    var _x = 0;
    var _y = 0;
    var _width = 0;
    var _heigh = 0;
    var _point = null;
    var _pixel = null;
    var opts = null;
    var radius = null;
    var _points = null;
    var _left=null;
    var _top = null;
    var _galCanvas = null; //全局变量
    //数据解析器
    function xDataParse() {

    }
    xDataParse.prototype = {

        /* V2
解析数据
@tmpl 模板信息
*/
        parseTemplate: function (tmpl) {


            if (tmpl && tmpl.IsParse) {

                return;
            }
            tmpl.IsParse = true;
            var overlayType = tmpl[xFields.OverlayType];
            if (overlayType == xOverlay.Types.Polygon) { //解析多变形
                if (!tmpl[xFields.Points] || typeof (tmpl[xFields.Points]) != "string") {
                    return;
                }
                tmpl[xFields.Points] = this.parsePoints(tmpl[xFields.Points]); //解析点集合坐标为百度地图的坐标
                if (tmpl[xFields.InnerRings] && tmpl[xFields.InnerRings].length > 0) {
                    for (var i = 0; i < tmpl[xFields.InnerRings].length; i++) {
                        var pointstring = tmpl[xFields.InnerRings][i].Points;
                        tmpl[xFields.InnerRings][i].Points = this.parsePoints(pointstring); //解析内环的点坐标为百度地图坐标
                    }
                }
            }
            else if (overlayType == xOverlay.Types.Polyline) { //解析多变形
                if (!tmpl[xFields.Points] || typeof (tmpl[xFields.Points]) != "string") {
                    return;
                }
                tmpl[xFields.Points] = this.ParsePoints(tmpl[xFields.Points]); //解析点集合坐标为百度地图的坐标

            }
            else if (overlayType == xOverlay.Types.MultiPolygon) { //解析多图层
                if (!tmpl[xFields.Polygons]) {
                    return;
                }
                for (var i = 0; i < tmpl[xFields.Polygons].length; i++) {
                    var polygonTemplate = tmpl[xFields.Polygons][i];
                    this.parseTemplate(polygonTemplate);
                }
            } else if (overlayType == xOverlay.Types.Polylines) {
                //将数据中的MultiPolyline解析为 MultiPolyline:[{Points:[{Lng:0,Lat:0}]}]格式
                if (tmpl[xFields.Polylines]) {

                }
            }
        },
        /* V2
        解析面与线点集合数据
        @pointStrings格式【  116.71107,23.648729 116.709933,23.648454】
        */
        parsePoints: function (pointStrings) {
            var bmapPoints = [];
            if (!pointStrings || pointStrings.length == 0 || pointStrings == "") {
                return null;
            }
            var _points = pointStrings.split(" ");
            for (var i = 0; i < _points.length; i++) {
                var _point = _points[i];
                if (_point) {
                    var __point = _point.split(",");
                    var lng = __point[0];
                    var lat = __point[1];
                    if (lng && lat) {
                        bmapPoints.push(new BMap.Point(lng, lat));
                    }
                }
            }
            pointStrings = null;
            return bmapPoints;
        },
        parsePointsForMultiPolyline: function (pointStrings) {
            var bmapPoints = [];
            if (!pointStrings || pointStrings.length == 0 || pointStrings == "") {
                return null;
            }
            var _points = pointStrings.Points.split(" ");//不同点：在分割之前添加Points属性再分割
            for (var i = 0; i < _points.length; i++) {
                var _point = _points[i];
                if (_point) {
                    var __point = _point.split(",");
                    var lng = __point[0];
                    var lat = __point[1];
                    if (lng && lat) {
                        bmapPoints.push(new BMap.Point(lng, lat));
                    }
                }
            }
            pointStrings = null;
            return bmapPoints;
        }
    }




  
 function xCanvas() {

    }
    xCanvas.prototype = new BMap.Overlay();
    xCanvas.prototype.map = null;
    /*
    是否优化
    */
    xCanvas.prototype.isOptimize = true;
    xCanvas.prototype.overlay = null;
    xCanvas.prototype.context = null;
    xCanvas.prototype.modules = [];
    xCanvas.prototype.width = null;
    xCanvas.prototype.height = null;
    xCanvas.prototype.offsetLeft = null;
    xCanvas.prototype.offsetTop = null;
    /*
    添加模块信息
    @moduleName 模块名称
    @tmpls 模板信息  [{overlay:'Image',lat:23,lng:110,name,onClick=function(){},name:"Guren_D"}]
    @onDrawBefore 绘制之前事件（function(ctx,param) ctx =>Html5 Context对象 ，param =>{Image:dom,offsetLeft:20,offsetTop:20 }可通过设置）
    @onDrawCompleted 绘制完成事件
    */
    xCanvas.prototype.addModule = function (moduleName, tmpls, onDrawBefore, onDrawCompleted) {
        var json = {};
        json[xFields.Name] = moduleName;
        json[xFields.Tmpls] = tmpls;
        json.onDrawBefore = onDrawBefore;
        json.onDrawCompleted = onDrawCompleted;
        this.modules.push(json);
    }

    xCanvas.prototype.eachModule = function (onfun,onBefore,onCompleted) {
        for (var i = 0; i < this.modules.length; i++) {
            var module = this.modules[i];
            if (onBefore) {
                onBefore(module);
            }
            if (module.tmpls) {
                for (var j = 0; j < module[xFields.Tmpls].length; j++) {
                    var tmpl = module[xFields.Tmpls][j];
                    
                    onfun(module, tmpl);
                }
            }
            if (onCompleted) {
                onCompleted(module);
            }
        }
    }

    /*
移除模块信息
*/
    xCanvas.prototype.removeModule = function (moduleName) {
        for (var i = 0; i < this.modules.length; i++) {
            var module = this.modules[i];
            if (module[xFields.Name] == moduleName) {
                this.modules.splice(i, 1);
                break;
            }
        }
    }


    xCanvas.prototype.SelectedOverlay = null;
    xCanvas.prototype.SelectedItem = null;
    xCanvas.prototype.isSelected = false;

    /*
    选中事件
    @overlay 当前选中图层
    @moduleName 模块名称
    @tmpl 当前数据
    */
    xCanvas.prototype.onSelected = function (tmpl, overlay, moduleName) {

    }
    xCanvas.prototype.initSelectedOverlayEvents = function (moduleName,tmpl)
    {
        var me = this;
        me.SelectedOverlay.addEventListener("mouseout", function (e) {
            me.isSelected = false;
          //  me.map.removeOverlay(me.SelectedOverlay);
        })
        me.SelectedOverlay.addEventListener("click", function (e) {
            if (me.SelectedItem.onClick) {
                me.SelectedItem.onClick(tmpl, me.SelectedOverlay, moduleName);
            } else {
                me.onSelectedClick(tmpl, me.SelectedOverlay, moduleName);
            }
        });
    }

    /*
    图层点击事件
    @selectedOverlay 当前选中图层
   @moduleName 模块名称
   @tmpl 当前数据
    */
    xCanvas.prototype.onSelectedClick = function (tmpl, overlay, moduleName) {

    }

    var tempPoint = null;
    xCanvas.prototype.setSelectedOverlay = function (tmpl,onGetOverlay) {

        var me = this;
        me.isSelected = true;
        if (me.SelectedItem == tmpl) {
            return;
        }
        me.SelectedItem = tmpl;
        var overlay = onGetOverlay();
        if (me.SelectedOverlay) {
            me.map.removeOverlay(me.SelectedOverlay);
        }
        me.SelectedOverlay = overlay;
        if (me.SelectedItem.name && me.SelectedOverlay.setTitle) {
            me.SelectedOverlay.setTitle(me.SelectedItem[xFields.Name]);
        }
        me.onSelected(tmpl, me.SelectedOverlay, module[xFields.Name]);
        me.initSelectedOverlayEvents(module[xFields.Name], tmpl);
        me.map.addOverlay(me.SelectedOverlay);
    }
    /*
     模拟鼠标移动事件
     @point 当前坐标点
    */
    xCanvas.prototype.simulationMousemover = function (point) {

        var me = this;
        if (me.isSelected) {
            return;
        }
        
        var pix = xUtility.getPixelDistance(this.map);

        me.isSelected = false;
        this.eachModule(function (module, tmpl) {

            if (me.isSelected) {
                return;
            }
            var overlayType = tmpl[xFields.OverlayType];
            switch (overlayType) {
                case xOverlay.Types.Image:
                case xOverlay.Types.Point:
                case xOverlay.Types.Circle:
                    tempPoint = new BMap.Point(tmpl.lng, tmpl.lat);
                    if (me.isShow(tmpl) &&  xUtility.isPointInCircle(point, tmpl[xFields.Lng], tmpl[xFields.Lat], tmpl.radius * pix)) {
                        var overlay = null;
                        me.setSelectedOverlay(tmpl, function () {
                            if (overlayType == xOverlay.Types.Image) {
                                overlay = xOverlay.createMarker(me.SelectedItem);
                            } else {
                                overlay = xOverlay.createCircle(me.SelectedItem, me.SelectedItem.radius * pix);
                            }
                            return overlay;
                        });
               
                    }
                    break;

                case xOverlay.Types.Polygon:
                case xOverlay.Types.PointRectange:
                    if (me.isShow(tmpl) && xUtility.isPointInPolygon(point, tmpl[xFields.Points])) {
                        me.setSelectedOverlay(tmpl, function () {
                         
                            return xOverlay.createPolygon(tmpl);
                        });
                    }
                    break;
                case xOverlay.Types.Polyline:
                    if (me.isShow(tmpl) && xUtility.isPointInPolyline(point, tmpl[xFields.Points])) {
                        me.setSelectedOverlay(tmpl, function () {

                            return xOverlay.createPolyline(tmpl);
                        });
                    }
                    break;
                case xOverlay.Types.MultiPolygon:
                    for (var i = 0; i < tmpl[xFields.Polygons].length; i++) {
                        var polygonTmpl = tmpl[xFields.Polygons][i];
                        if (me.isShow(polygonTmpl) && xUtility.isPointInPolygon(point, polygonTmpl[xFields.Points])) {
                            me.setSelectedOverlay(polygonTmpl, function () {
                                return xOverlay.createPolygon(polygonTmpl);
                            });
                        }
                    }
                    break;
                case xOverlay.Types.MultiPolyline:
                    for (var i = 0; i < tmpl[xFields.Polylines].length; i++) {
                        var polylineTmpl = tmpl[xFields.Polylines][i];
                        if (!me.isSelected &&  me.isShow(polylineTmpl) && xUtility.isPointInPolyline(point, polylineTmpl[xFields.Points])) {
                            me.setSelectedOverlay(polylineTmpl, function () {
                                return xOverlay.createPolyline(polylineTmpl);

                            });
                        }
                    }
                    break;
                default:
                    break;
            }
        });
 
        if (!me.isSelected && this.SelectedOverlay) {
            me.map.removeOverlay(this.SelectedOverlay);
            me.SelectedItem = null;
        }
    }
    xCanvas.prototype.onMapMouseMove = function () {
        var me = this;
        me.map.addEventListener("mousemove", function (type, target, point, pixel, overlay) {
            var _point = type.point;
            me.simulationMousemover(_point);
        });
    }
    xCanvas.prototype.setDefaultStyle = function (ctx) {
        ctx.strokeStyle = "#A020F0"
        ctx.fillStyle = "Green";
        ctx.globalAlpha = 0.7;
    }
    /*
    重绘方法
    */
    xCanvas.prototype.draw = function (e, e1, e2, e3, e4, e5) {
        var me = this;
        this._center = this.map.getCenter();
        // 根据地理坐标转换为像素坐标，并设置给容器 
        _pixel = this.map.pointToOverlayPixel(this._center);
        this.left = _pixel.x - this.width / 2;
        this.top = _pixel.y - this.height / 2;
        this.setCanvasPosiction(this.canvas, this.left, this.top);
        this.setCanvasPosiction(this.penetrationCanvas, this.left, this.top);
        this.totalExcuteTime("清除画布", function () {
            me.clear();
        });
        this.totalExcuteTime("重绘", function () {
            me.onDraw();
        });
        this.isSelected = false;
    }
    /*
    设置画布位置
    */
    xCanvas.prototype.setCanvasPosiction = function (canvas,left,top) {
        canvas.style.top = top + "px";
        canvas.style.left = left + "px";
    }
    //穿透效果画布
    xCanvas.prototype.penetrationCanvas = null;
    xCanvas.prototype.canvas = null;
    xCanvas.prototype.initialize = function (map) {
  
        var me = this;
        this.map = map;
        this.canvas = me.createCanvas(map);
        this.overlay = this.canvas;
        this.penetrationCanvas = me.createCanvas(map, -50);
        this.onMapMouseMove();
    }
    /*创建画布
    @map 地图对象
    @zIndex zIndex
    */
    xCanvas.prototype.createCanvas=function(map,zIndex){
        var canvas = document.createElement("canvas");
        canvas.innerHTML = "浏览器不支持HTML5！";
        map.getPanes().mapPane.appendChild(canvas);
        if (!this.width) {
            this.width = parseFloat(map.getContainer().clientWidth);
        }
        if (!this.height) {
            this.height = parseFloat(map.getContainer().clientHeight);
        }
		//alert(this.width);
        canvas.style.position = "absolute";
        canvas.style.zIndex = !zIndex ? -100 : zIndex;
        canvas.width = this.width;
        canvas.height = this.height;
        this.setDefaultStyle(this.getContext(canvas));
        return canvas;
    }
    xCanvas.prototype.getContext=function(canvas){
        return canvas.getContext("2d");
    }
    xCanvas.prototype.clearModules=function(){
        this.modules.length=0;
        this.clear();
    }
    xCanvas.prototype.clear = function () {

        var cxt = this.getContext(this.canvas);
        cxt.clearRect(0, 0, this.width, this.height);
        cxt = this.getContext(this.penetrationCanvas);
        cxt.clearRect(0, 0, this.width, this.height);
    };
    var isShowField = "isShow";
    xCanvas.prototype.setDisplay = function (tmpl,isShow) {
        tmpl[isShowField] = isShow;
    }
    xCanvas.prototype.isShow = function (tmpl) {
        return tmpl[isShowField];
    }
    xCanvas.prototype.maxOverlayCount = 20000;
    xCanvas.prototype.getSkipDivisor = function (length) {
        var level = this.map.getZoom();
        if (level > 10) {
            return 1;
        }
        if (length < this.maxOverlayCount) {
            return 1;
        }
  
        var mul = Math.ceil( length / (this.maxOverlayCount*50));
        var onePixelMi = xUtility.getPixelDistance(this.map);
        onePixelMi = onePixelMi == 0 ? 1500 : parseInt(Math.ceil(onePixelMi / (level > 5 ? level * mul : 3)));
        return (onePixelMi );
    }
    /*
    重绘事件
    */
    xCanvas.prototype.onDraw = function () {
        var canvas = this.overlay;
        var me = this;
        var southWestPoint=this.map.getBounds().getSouthWest();
        var northEastPoint = this.map.getBounds().getNorthEast();
        if (southWestPoint == null) {
            return;
        }
        var point = null;
        var start = null;//起始时间
        var end = null;
        var excuteTime = null;
        var ydcs = 0;
        var isShow = false;
        var skipDivisor = 0;
        var moduleName = null;
        var boundPoints =xUtility.getBoundPoints(northEastPoint,southWestPoint);
        this.eachModule(function (module, tmpl) {
            isShow =false;
            var overlayType = tmpl[xFields.OverlayType];
            
          
            switch (overlayType) {
                case xOverlay.Types.Image:
                case xOverlay.Types.Point:
                case xOverlay.Types.Circle:
                case xOverlay.Types.PointRectange:
                    point = { lng: tmpl.lng, lat: tmpl.lat };
                    if (xUtility.isPointInRect(point, southWestPoint, northEastPoint))
                    {
                        if (!me.isOptimize || ydcs % skipDivisor == 0) {
                            switch (overlayType) {
                                case xOverlay.Types.Image:
                                    me.drawImage(canvas, point, module.onDrawBefore, module.onDrawCompleted, tmpl, moduleName);
                                    break;
                                case xOverlay.Types.Point:
                                    me.drawCircle(canvas, point, module.onDrawBefore, module.onDrawCompleted, tmpl, moduleName, 2);
                                    break;
                                case xOverlay.Types.Circle:
                                    me.drawCircle(canvas, point, module.onDrawBefore, module.onDrawCompleted, tmpl, moduleName);
                                    break;
                                case xOverlay.Types.PointRectange:
                                    me.drawPointRectangle(canvas, point, module.onDrawBefore, module.onDrawCompleted, tmpl, moduleName);
                                    break;
                                default:
                            }
                            isShow = true;
                        } 
                        ydcs++;
                    }
                    break;
                case xOverlay.Types.Polygon:
                    if (xUtility.isLinesInBounds(tmpl[xFields.Points], boundPoints)) {
                        me.drawPolygon(tmpl, module);
                        ydcs += tmpl[xFields.Points].length;
                        isShow = true;
                    }
                    break;
                case xOverlay.Types.MultiPolygon:
                    me.drawMultiPolygon(tmpl, module,boundPoints);
                    break;
                case xOverlay.Types.Polyline:
                    if (xUtility.isLinesInBounds(tmpl[xFields.Points], boundPoints)) {
                        me.drawPolyline(canvas, tmpl[xFields.Points], module.onDrawBefore, module.onDrawCompleted, tmpl, false, moduleName);
                        isShow = true;
                        ydcs += tmpl[xFields.Points].length;
                    }
                    break;
                case xOverlay.Types.MultiPolyline:
                    me.drawMultiPolyline(tmpl, module,boundPoints);
                    break;

                default:
                    break;
            }
            me.setDisplay(tmpl,isShow);
        },
        function (module)
        {
            start = new Date().getTime();//起始时间
            skipDivisor = me.getSkipDivisor(module[xFields.Tmpls].length);
            ydcs = 0;
             moduleName = module[xFields.Name];
        },
        function (module) {
             end = new Date().getTime();//接受时间
             excuteTime = "模块名称：" + module[xFields.Name] + ",图层数:" + module[xFields.Tmpls].length + "个,绘制次数:：" + ydcs + "次,执行时间:" + (end - start) + "ms";//返回函数执行需要时间
            if (console && console.log) {
                console.log(excuteTime);
            }
        });
        
    }

    xCanvas.prototype.totalExcuteTime = function (moduleName, onaction) {
        var
        start = new Date().getTime();//起始时间
        onaction();
        var  end = new Date().getTime();//接受时间

       //返回函数执行需要时间
        if (console && console.log) {
            console.log("模块："+moduleName+", 执行时间:" + (end - start) + "ms");
        }
    }
    /****************************************************绘图相关*******************************************************/
    xCanvas.prototype.drawImage = function (canvas, postions, onBefore, onCompleted, param, moduleName) {
        var myCanvas = canvas
        var cxt = myCanvas.getContext("2d");
        if (cxt) {
            if (!param) {
                param = cxt;
            }
            cxt.save();
            if (!onBefore) {
                onBefore = this.setDefaultStyle(cxt);
            }
            opts= onBefore(param, cxt, moduleName);
            if (opts.image) {
                param.image = opts.image;
            } else if (opts) {
                param.image = opts;
            }
            if (opts.offsetTop) {
                param.offsetTop = opts.offsetTop;
            }
            if (opts.offsetLeft) {
                param.offsetLeft = opts.offsetLeft;
            }
            if (!param.image) {
                alert("图片未设置");
            }
            if (!param.width) {
                param.width = param.image.naturalWidth;
            }
            if (!param.height) {
                param.height = param.image.naturalHeight;
            }
            if (!param.offsetTop) {
                param.offsetTop = param.offsetTop ? param.offsetTop : param.height;
            }
            if (!param.offsetLeft) {
                param.offsetLeft = param.offsetLeft ? param.offsetLeft : param.width / 2;
            }
            if (!param.radius) {
                param.radius = param.width / 2;
            }
            if (!param.point) {
                param.point = new BMap.Point(postions.lng, postions.lat);
            }
            cxt.globalAlpha = 1;
            _pixel = this.map.pointToOverlayPixel(param.point);
            _x = _pixel.x - this.left - param.offsetLeft;
            _y = _pixel.y - this.top - param.offsetTop;
            
            
            cxt.drawImage(param.image, _x, _y)
         
            if (onCompleted) {
                onCompleted(param, cxt, moduleName);
            }
            cxt.restore();
        }
    }
    /*  根据点绘制成矩形
 @postion点 [{x:1,y:2}]
 @onBefore(param,ctx) 开始事件 param默认为 ctx  ,返回 {Width:10,Height:10} JSON对象用于设置宽度跟高度（默认10，10）
 @onCompleted(param,ctx) 完成事件
 @isBaiduMapCoordinate 是否是百度地图坐标
 @param 自定义回调函数参数默认为ctx
 */
    xCanvas.prototype.drawPointRectangle = function (canvas, postions, onBefore, onCompleted, param, requestType) {
        var myCanvas = canvas
        var cxt = myCanvas.getContext("2d");
        if (cxt) {
            if (!param) {
                param = cxt;
            }
            cxt.save();
            if (!onBefore) {
                onBefore = this.SetDefaultStyle(cxt);
            }
            param = !param ? {} : param;
            // onBefore(param.cxt,requestType);
            var options = onBefore(param, cxt, requestType);
            options = options ? options : {};
            if (!param[xFields.Width]) {
                param[xFields.Width] = param[xFields.Width] ? param[xFields.Width] : (!options[xFields.Width] ? 16 : options[xFields.Width]);
            }
            if (!param[xFields.Height]) {
                param[xFields.Height]=  param[xFields.Height] ? param[xFields.Height] : (!options[xFields.Height] ? 16 : options[xFields.Height]);
            }
           
            if (!param[xFields.Point]) {
                param[xFields.Point] = new BMap.Point(postions[xFields.Lng], postions[xFields.Lat]);
            }
            _pixel = this.convertToPixel(param[xFields.Point]);
            _width = param[xFields.Width];
            _heigh = param[xFields.Height];
            _x = _pixel.x - this.left;
            _y = _pixel.y - this.top;
            _x1 = _x - _width / 2;
            _y1 = _y - _heigh / 2;
             _x2 = _x + _width / 2;
             _y2 = _y + _heigh / 2;
             _p1 = { x: _x1, y: _y1 };
             _p2 = { x: _x1, y: _y2 };
             _p3 = { x: _x2, y: _y2 };
             _p4 = { x: _x2, y: _y1 };
            cxt.beginPath();
            cxt.moveTo(_p1.x, _p1.y);
            cxt.lineTo(_p2.x, _p2.y);
            cxt.lineTo(_p3.x, _p3.y);
            cxt.lineTo(_p4.x, _p4.y);
            if (param) {
                if (param[xFields.Points]) {
                    param[xFields.Points].length = 0;
                } else {
                    param[xFields.Points] = [];
                }
                param[xFields.Points].push(this.convertToPoint(_p1.x + this.left, _p1.y + this.top));
                param[xFields.Points].push(this.convertToPoint(_p2.x + this.left, _p2.y + this.top));
                param[xFields.Points].push(this.convertToPoint(_p3.x + this.left, _p3.y + this.top));
                param[xFields.Points].push(this.convertToPoint(_p4.x + this.left, _p4.y + this.top));
            }
            cxt.closePath();
            cxt.fill();
            cxt.stroke();
            if (onCompleted) {
                onCompleted(param, cxt, requestType);
            }
            cxt.restore();
        }
    }


    xCanvas.prototype.DrawText = function (tmpl, cxt) {
        if (!tmpl || !tmpl.name) {
            return;
        }
        if (tmpl.nameWidth) {
            tmpl.nameWidth = cxt.measureText(tmpl.name).width;
        }
        var overlayType = tmpl[xFields.OverlayType];
        switch (overlayType) {
            case xOverlay.Types.Polygon:
                break;
            case xOverlay.Types.Polyline:
                break;
            case xOverlay.Types.Point:
            case xOverlay.Types.Circle:
                break;
            case xOverlay.Types.Image:
                break;
            default:

        }

        var nameTmpls = [];//获取到绘制文字的坐标
        if (tmpl.Points && tmpl.Points.length > 0) {
            if (tmpl.NameTmpls.length == 0) {
                var nameTmpl = {};
                _points =tmpl[xFields.Points];
                if (tmpl.OverlayType == xOverlay.Types.Polygon) {
                    nameTmpl.CenterPoint = xMapUtils.GetCenterForPolygon(_points, nameTmpl);
                } else if (tmpl.OverlayType == xOverlay.Types.Polyline) {
                    nameTmpl.Bounds = xMapUtils.GetBoundsForPoints(tmpl[xFields.Points]);
                    nameTmpl.CenterPoint = xMapUtils.GetCenterForPolyline(tmpl[xFields.Points]);
                }
                tmpl.NameTmpls.push(nameTmpl);
            }
        }
        else if (tmpl.MultiPoints && tmpl.MultiPoints.length > 0) {
            if (tmpl.NameTmpls.length == 0) {
                for (var i = 0; i < tmpl.MultiPoints.length; i++) {
                    var nameTmpl = {};
                    var points = tmpl.MultiPoints[i];
                    if (tmpl.OverlayType == "Polygon") {
                        nameTmpl.CenterPoint = xMapUtils.GetCenterForPolygon(points, nameTmpl);
                    } else if (tmpl.OverlayType == "Polyline") {
                        nameTmpl.Bounds = xMapUtils.GetBoundsForPoints(points);
                        nameTmpl.CenterPoint = xMapUtils.GetCenterForPolyline(points);
                    }
                    tmpl.NameTmpls.push(nameTmpl);

                }
            }
        }
        if (!tmpl.Name) {
            return;
        }
        var displayLevel = 11;
        var level = this.GetLevel();
        if (level < displayLevel) {
            return;
        }
        var leftPoint = new BMap.Point(0, 0);
        var rightPoint = new BMap.Point(0, 0);
        var leftPosition = null;
        var rightPosition = null;
        var centerPosition = null;
        var centerPoint = null;
        var currentWidth = null;
        for (var i = 0; i < tmpl.NameTmpls.length; i++) {
            var nameTmpl = tmpl.NameTmpls[i];

            centerPoint = nameTmpl.CenterPoint;
            if (centerPoint == null) {
                continue;
            }
            leftPoint.lng = nameTmpl.Bounds.SouthWestLng;
            leftPoint.lat = nameTmpl.Bounds.NorthEastLat;

            rightPoint.lng = nameTmpl.Bounds.NorthEastLng;
            rightPoint.lat = nameTmpl.Bounds.NorthEastLat;
            leftPosition = this._map.pointToOverlayPixel(leftPoint);//获取到描绘在画板的坐标
            rightPosition = this._map.pointToOverlayPixel(rightPoint);//获取到描绘在画板的坐标
            currentWidth = rightPosition.x - leftPosition.x;
            if (currentWidth < nameWidth) {
                continue;
            }
            centerPosition = this._map.pointToOverlayPixel(centerPoint);//中间点
            centerPosition.x -= (nameWidth / 2);
            // centerPosition.y -= (nameHeight / 2);
            this.DrawText(centerPosition.x, centerPosition.y, tmpl.Name);
        }
        leftPoint = null;
        rightPoint = null;
        leftPosition = null;
        rightPosition = null;
        centerPosition = null;
        centerPoint = null;
        currentWidth = null;

    }

    /*  绘制多变形
@postions 点集合 [{x:1,y:2}]
@onBefore(param,ctx) 开始事件 param默认为 ctx
@onCompleted(param,ctx) 完成事件
@isBaiduMapCoordinate 是否是百度地图坐标
@param 自定义回调函数参数默认为ctx
*/
 xCanvas.prototype.drawPolygon = function (tmpl, requestModule) {
     var canvas = this.canvas;

     var innerRings = tmpl[xFields.InnerRings];
     if (tmpl && innerRings && innerRings.length > 0) {
            canvas = this.penetrationCanvas;
        }
        var ctx = canvas.getContext("2d");
        this.drawPolyline(canvas, tmpl.points, module.onDrawBefore, module.onDrawCompleted, tmpl,true, module.name);
        //画穿透图层
        if (tmpl.innerRings && innerRings.length > 0) {
            for (var i = 0; i < innerRings.length; i++) {
                var points = innerRings[i].points;
                //穿洞效果
                this.drawPolyline(canvas, points, function (tmpl, ctx) {
                    ctx.globalCompositeOperation = "destination-out";
                    ctx.globalAlpha = 1;
                }, function () {
                },
                 {},true, requestModule.name);
                this.drawPolyline(canvas, points, function (tmpl, ctx) {
                    //ctx.globalCompositeOperation = "destination-out";
                    //    ctx.globalAlpha = 0.1;
                    ctx.fillStyle = 'rgba(225,225,225,0)';
                }, function () {
                },
                tmpl, true,requestModule.name);
            }
        }
       // this.DrawName(tmpl, ctx);

    }
    /*  绘制线条
    @postions 点集合 [{x:1,y:2}]
    @onBefore(param,ctx) 开始事件 param默认为 ctx
    @onCompleted(param,ctx) 完成事件
    @isBaiduMapCoordinate 是否是百度地图坐标
    @param 自定义回调函数参数默认为ctx
    @isPloygon 是否绘制为多边形
    */
 xCanvas.prototype.drawPolyline = function (canvas, points, onBefore, onCompleted, param, isPloygon, requestType) {

     var me = this;
        if (!points || points.length == 0) {
            return;
        }
        if (canvas.getContext) {
            var ctx = me.getContext(canvas);
            ctx.save();
            ctx.beginPath();
            if (!onBefore) {
                onBefore = function () { };
            }
            if (!param) {
                param = ctx;
            }
            if (!isPloygon) {  //绘制多边形
                ctx.globalAlpha = 0.8;
                ctx.lineWidth = 3;
            } else {
                ctx.globalAlpha = 0.6;
                ctx.lineWidth = 1;
            }
            if (onBefore) {
                onBefore(param, ctx, requestType);
            }
            for (var j = 0; j < points.length; j++) {
                _point = points[j];
                if (!(_point instanceof BMap.Point)) {
                    points[j] = new BMap.Point(_point[xFields.Lng], _point[xFields.Lat]);
                }
                    //将经纬度转换为屏幕坐标
                _pixel = this.convertToPixel(points[j]);
                _x=_pixel.x - this.left;
                _y=_pixel.y - this.top;
                j == 0 ?   ctx.moveTo(_x, _y) :   ctx.lineTo(_x,_y)
            }
            if (isPloygon) {  //绘制多边形
                ctx.fill();
                ctx.closePath();
            }
            if (onCompleted) {
                onCompleted(param, ctx, requestType);
            }
            ctx.stroke();
            ctx.restore();
        }
    }

 xCanvas.prototype.drawMultiPolyline = function (tmpl, module,mapBoundPoints) {
     var me = this;
     if (!tmpl || !tmpl[xFields.Polylines]) {
            return;
        }
        for (var i = 0; i < tmpl[xFields.Polylines].length; i++) {
            var polylineTemplate = tmpl[xFields.Polylines][i];
            if (!polylineTemplate.isCopyFields) {
                for (var name in tmpl) {
                    if (name == xFields.Polylines || name == xFields.Points ) {
                        continue;
                    }
                    polylineTemplate[name] = tmpl[name];
                }
                polylineTemplate.isCopyFields = true;
            }
            me.setDisplay(polylineTemplate, false);
            if (xUtility.isLinesInBounds(polylineTemplate[xFields.Points], mapBoundPoints)) {
                this.drawPolyline(this.canvas, polylineTemplate[xFields.Points], module.onDrawBefore, module.onDrawCompleted, polylineTemplate, false, module.name);
                me.setDisplay(polylineTemplate, true);
            }
        }
    }
    /*
绘制多图层的（带穿透效果）
@tmpl 图层
@requestModule 请求模块
*/
    xCanvas.prototype.drawMultiPolygon = function (tmpl, requestModule,mapBoundPoints) {
      
        var me =this;
        if (!tmpl || !tmpl[xFields.Polygons]) {
            return;
        }
        for (var i = 0; i < tmpl[xFields.Polygons].length; i++) {
            var polygonTemplate = tmpl[xFields.Polygons][i];
            if(!polygonTemplate.isCopyFields){
                for (var name in tmpl) {
                    if (name == xFields.Polygons || name == xFields.Points) {
                        continue;
                    }
                    polygonTemplate[name] = tmpl[name];
                }
                polygonTemplate.isCopyFields=true;
            }
            me.setDisplay(polygonTemplate, false);
            if (xUtility.isLinesInBounds(polygonTemplate[xFields.Points], mapBoundPoints)) {
                this.drawPolygon(polygonTemplate, requestModule);
                me.setDisplay(polygonTemplate, true);
            }
        }
    }
    xCanvas.prototype.convertToPoint = function (x, y) {
        var point = this.map.overlayPixelToPoint(new BMap.Pixel(x, y));
        return point;
    }
    xCanvas.prototype.convertToPixel = function (point) {
        return this.map.pointToOverlayPixel(point);
    }
    /*  绘制圆形
    @posiction 点集合 [{x:1,y:2,r:10}]
    @onBefore(param,ctx) 开始事件 param默认为 ctx
    @onCompleted(param,ctx) 完成事件
    @isBaiduMapCoordinate 是否是百度地图坐标
    @param 自定义回调函数参数默认为ctx
    */
    xCanvas.prototype.drawCircle = function (canvas, point, onBefore, onCompleted, param, requestType,defaultRadius) {
        var myCanvas = canvas
        var cxt = myCanvas.getContext("2d");
        if (cxt) {
            if (!param) {
                param = cxt;
            }
            cxt.save();
            if (!onBefore) {
                onBefore = this.setDefaultStyle(cxt);
            }
            // onBefore(param.cxt,requestType);
             radius = onBefore(param, cxt, requestType);
             param = !param ? {} : param;
             if (!param.radius) {
                 param.radius = isNaN(radius) ? (defaultRadius ? defaultRadius : 5) : radius;
             }
             if (!param.point) {
                 param.point = new BMap.Point(point[xFields.Lng], point[xFields.Lat]);
             }
             _pixel = this.map.pointToOverlayPixel(param.point);
                _x =_pixel. x - this.left;
                _y = _pixel.y - this.top;
            cxt.beginPath();
            cxt.arc(_x, _y, param.radius, 0, Math.PI * 2, false);
            cxt.closePath();
            cxt.fill();
            cxt.stroke();
            if (onCompleted) {
                onCompleted(param, cxt, requestType);
            }
            cxt.restore();
        }
    }
  
  
  
    var obj = {
        //创建画布
        createCanvas: function (map) {
            if (!_galCanvas) {
                _galCanvas = new xCanvas(map);
            }
            return _galCanvas;
        },
        //创建点图形
        createMarker: function (opts) {

            var marker = new BMap.Marker(new BMap.Point(opts.lng, opts.lat));
            if (opts.isAnimation) {
            }
            if (opts.image && !opts.src) {
                opts.src = opts.image.src;
            }
            if (opts.src) {
                var icon = new BMap.Icon(opts.src, new BMap.Size(opts.width, opts.height), {
                    anchor: new BMap.Size(opts.offsetLeft, opts.offsetTop)
                });
                marker.setIcon(icon);
            }

            return marker;
        },
        //创建圆
        createCircle: function (opts, radius) {
            return new BMap.Circle(opts.point, radius, {});
        },
        //创建多变形
        createPolygon: function (opts) {
            return new BMap.Polygon(opts.points, {});
        },
        //创建线
        createPolyline: function (opts) {
           return new BMap.Polyline(opts.points, {});
        },
        Types: {
            Point: "Point",
            PointRectange: "PointRectange",
            Circle: "Circle",
            Image: "Image", //已实现提供
            Polyline: "Polyline",
            MultiPolyline: "MultiPolyline",
            Polygon: "Polygon",
            MultiPolygon: "Multipolygon"
        }
    }
    return obj;
})();

 