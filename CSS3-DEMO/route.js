define(['app'], function (app) {



    app.run(
        [          '$rootScope', '$state', '$stateParams',
            function ($rootScope,   $state,   $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }
        ]
    ).config(['$stateProvider', '$routeProvider', '$locationProvider', '$AppDataProvider',
        function ($stateProvider, $routeProvider, $locationProvider, $AppDataProvider)
    {


var menus={
  "list": [
    {
      "Name": "首页",
      "Url": "index",
      "TemplateUrl": "Views/Home/Index.html",
      "Controller": "HomeController"
    },
    {

     "Name": "百度地图",
      "Url":"baidumap",
      "SubMenus":[
        {
          "Name":"创建百度地图",
          "Url": "index",
          "TemplateUrl": "Views/Gis/demo_Index.html"
        },
        {
          "Name":"创建标记点",
          "Url": "marker",
          "TemplateUrl": "Views/Gis/demo_marker.html"
        }
      ,
        {
          "Name":"创建文字标签",
          "Url": "lable",
          "TemplateUrl": "Views/Gis/demo_lable.html"
        }
      ,
        {
          "Name":"创建线",
          "Url": "polyline",
          "TemplateUrl": "Views/Gis/demo_polyline.html"
        }
      ,
        {
          "Name":"创建面",
          "Url": "polygon",
          "TemplateUrl": "Views/Gis/demo_polygon.html"
        }
      ,
        {
          "Name":"定位",
          "Url": "geolocation",
          "TemplateUrl": "Views/Gis/demo_geolocation.html"
        }
      ]
    },
    {
      "Name": "Canvas",
      "Url": "canvas",
      "SubMenus": [
        {
          "Name": "创建Canvas",
          "Url": "index",
          "TemplateUrl": "Views/canvas/demo_Index.html"
        },
        {
          "Name": "创建文字",
          "Url": "text",
          "TemplateUrl": "Views/canvas/demo_text.html"
        },
        {
          "Name": "创建图片",
          "Url": "image",
          "TemplateUrl": "Views/canvas/demo_image.html"
        },
        {
          "Name": "创建圆",
          "Url": "circle",
          "TemplateUrl": "Views/canvas/demo_circle.html"
        },
        {
          "Name": "创建线",
          "Url": "polyline",
          "TemplateUrl": "Views/canvas/demo_polyline.html"
        },
        {
          "Name": "创建面",
          "Url": "polygon",
          "TemplateUrl": "Views/canvas/demo_polygon.html"
        }
      ]
    }
  ,
    {
      "Name": "地图",
      "Url": "gis",
      "SubMenus": [
        {
          "Name": "xOverlay(图层)",
          "Url": "overlay",
          "TemplateUrl": "Views/Gis/Index.html",
          "SubMenus": [
            {
              "Name": "point",
              "Url": "point",
              "TemplateUrl": "Views/Gis/point.html"
            },
            {
              "Name": "image",
              "Url": "image",
              "TemplateUrl": "Views/Gis/image.html"
            },
            {
              "Name": "pointRectangle",
              "Url": "pointRectangle",
              "TemplateUrl": "Views/Gis/pointRectangle.html"
            },
            {
              "Name": "polyline",
              "Url": "polyline",
              "TemplateUrl": "Views/Gis/polyline.html"
            },
            {
              "Name": "multiPolyline",
              "Url": "multiPolyline",
              "TemplateUrl": "Views/Gis/multiPolyline.html"
            },
            {
              "Name": "polygon",
              "Url": "polygon",
              "TemplateUrl": "Views/Gis/polygon.html"
            },
            {
              "Name": "multiPolygon",
              "Url": "multiPolygon",
              "TemplateUrl": "Views/Gis/multiPolygon.html"
            }
          ]
        },
        {
          "Name":"类参考",
          "Url": "ApiDocument",
          "TemplateUrl": "Views/Gis/ApiDocument.html",
          "SubMenus":[],
          "Controller":"BMapAPIController"
        }
      ]
    },
    {
      "Name": "源码下载",
      "Url": "download",
      "TemplateUrl": "Views/download/index.html",
      "Controller": "DownloadController"
    }
  ]
};

            var module = $AppDataProvider.getInstance().createModule("Menu");
            


                    /*
                    *   var state=  $stateProvider.state(
                     "webApp",
                     {
                     url:"",
                     templateUrl:"Content.html",
                     controller:"IndexController"
                     });
                    * */
                  var state=  $stateProvider.state(
                        "app",
                        {
                            url:"",
                            templateUrl:"content.html",
                            controller:"HomeController"
                        });


                    //return ;
                var list = menus;
                    for(var  i=0; i<list.length;i++){

                        var _list = list[i];
                        var _name =_list.Name;
                        var _url =_list.Url;
                        var _templateUrl =_list.TemplateUrl;
                        var _subMenus =_list.SubMenus;
                        var _controller = _list.Controller;
                        if(_subMenus && _subMenus.length>0){

                            state.state("app." + _url, {
                                url: "#"

                            });
                            for(var j =0 ; j<_subMenus.length;j++ ){

                                var _subItem =_subMenus[j];
                                var _subName =_subItem.Name;
                                var _subUrl =_subItem.Url;
                                var _subTemplateUrl =_subItem.TemplateUrl;
                                var _subController = _subItem.Controller;

                                var _subSubMenus=_subItem.SubMenus;
                                var _subStateUrl ="app." + _url+_subUrl;


                              var subState=   state.state(_subStateUrl, {
                                    url: "/" + _url+"/"+_subUrl,
                                    templateUrl:_subTemplateUrl,
                                    controller:_subController
                                });

                                if(!_subSubMenus){
                                    continue;
                                }
                                for(var o = 0; o<_subSubMenus.length;o++){
                                   var _subSubItem =_subSubMenus[o];
                                    var _subSubName =_subSubItem.Name;
                                    var _subSubUrl =_subSubItem.Url;
                                    var _subSubTemplateUrl =_subSubItem.TemplateUrl;
                                    var _subSubController = _subSubItem.Controller;

                                    subState.state(
                                        _subStateUrl+"."+_subSubUrl, {
                                            url: "/"+_subSubUrl,
                                            templateUrl: _subSubTemplateUrl,
                                            controller: _subSubController
                                        });
                                }

                            }
                        }else {

                            state.state("app." + _url, {
                                url: "/" + _url,
                                templateUrl: _templateUrl,
                                controller:_controller
                            });
                        }
                    }
           


       //$locationProvider.html5Mode(true);
    }]);

})