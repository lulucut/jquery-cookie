/**
 * 功能說明：Cookie处理 v0.1
 * @author: 周海 zhouhai (zhouhai@ihomefnt.com)
 * @update: 2014-03-10
 */

define(function(require, exports, module){
    var $ = require('../zepto/zepto.js');

    function Cookie(){
        // 顶部搜索
        // this.isUpdateCookieTop = true;
        // this.defaultValTop = '';
        // this.defaultTempTop = true;

        // 历史记录
        this.searchNeedCookie = [];

        // 底部搜索
        this.isUpdateCookie = true,
        this.defaultVal = '',
        this.defaultTemp = true;
    }

    module.exports = Cookie;

    /**
     * 初始化
     *
     */
    Cookie.prototype.init = function() {
        // 顶部搜索框
        // this.initTop();

        // 底部搜索框
        this.initBottom();
    }

    /**
     * 添加Cookie
     *
     */
    Cookie.prototype.setCookie = function(objName, objValue, objHours, isReset){
        var nowDate = new Date();
        // if(objName === ''){
        //     objName = "_tuniu.wap_."+nowDate.getTime();
        // }
        if(isReset === 0){
            if(document.cookie.length > 0){
                var cookieArray = document.cookie.split("; ");
                for(var i = 0;i < cookieArray.length;i++){
                    var temp = cookieArray[i].split("=");
                    if((/_aijia.wap_./g).test(temp[0])){
                        var a = unescape(temp[1]);
                        var c_value = a.slice(0,a.lastIndexOf("~"));
                        if(c_value == objValue){
                            return;
                        }
                    }
                }
            }
        }

        // var str = objName + "=" + escape(objValue+"~"+nowDate.getTime());
        var str = objName + "=" + escape(objValue);

        if(objHours > 0){//为0时不设定过期时间，浏览器关闭时cookie自动消失
            var date = new Date();
            var ms = objHours*3600*1000;
            date.setTime(date.getTime() + ms);
            str += "; expires=" + date.toGMTString() + ";path=/";
        }
            document.cookie = str;
    };

    /**
     * 获取指定名称的cookie的值
     *
     */
    Cookie.prototype.getCookie = function(objName){
        var arrStr = document.cookie.split("; ");
        for(var i = 0;i < arrStr.length;i ++){
            var temp = arrStr[i].split("=");
            if(temp[0] == objName) return unescape(temp[1]);
        }
    };

    /**
     * 删除cookie
     *
     * 为了删除指定名称的cookie，可以将其过期时间设定为一个过去的时间
     */
    Cookie.prototype.delCookie = function(name){
        var date = new Date();
        date.setTime(date.getTime() - 10000);
        document.cookie = name + "=''; expires=" + date.toGMTString() + ";path=/";
    }

    /**
     * 点击历史记录跳转搜索页
     *
     */
    Cookie.prototype.searchByHistory = function(str){
        var q = searchCont.value;
        var url = document.getElementById("cosUrlsearch").value;
        var citylett = document.getElementById("cosUrlCity").value;
        var currentProductType = document.getElementById("currentProductType") ? document.getElementById("currentProductType").value : "";
        url=url+"/q/"+str;      //搜索值
        url=url+"/city/"+citylett;  //出发城市
        url=url+"/p/"+1;
        if(currentProductType == 4) {
            url = url+"/Sort-default/xc_day-/proSpeVal-/minPrice-/maxPrice-/Flag-/fun-" + 4;
        }
        window.location.href=url;
    }

    /**
     * 保存6个历史浏览记录
     *
     */
    Cookie.prototype.getLastSixCookie1 = function(str) {
        this.searchNeedCookie.length = 0;
        if(document.cookie.length > 0){
            var cookieArray = document.cookie.split("; ");
            for(var i = 0;i < cookieArray.length;i++){
                var temp = cookieArray[i].split("=");
                if((/_tuniu.wap_./g).test(temp[0])) {
                    this.searchNeedCookie.push(temp);
                }
            }
        }
        //获取最近6条
        this.searchNeedCookie.sort(function compare(a,b) {    //排序
            var a1 = unescape(a[1]);
            var b1 = unescape(b[1]);
            return a1.slice(a1.lastIndexOf("~")+1)-b1.slice(b1.lastIndexOf("~")+1);
        });

        if(/iPhone/ig.test(navigator.userAgent)) {
            this.searchNeedCookie.sort(function compare(a,b) {
                var a1 = unescape(a[1]);
                var b1 = unescape(b[1]);
                return b1.slice(b1.lastIndexOf("~")+1)-a1.slice(a1.lastIndexOf("~")+1);
            });
        }

        var saveLastCookie = [];
        var saveLastCookieCont = [];
        var cc = '';
        if(/iPhone/ig.test(navigator.userAgent)){
            //safari浏览器存储顺序的cookie和其他浏览器相反，此处用来处理ihpone下cookie
            if(this.searchNeedCookie.length >=6){
                for(var tt=0;tt < this.searchNeedCookie.length;tt++){
                    var list_name =unescape(this.searchNeedCookie[tt][1]);
                    if(tt < 6) {
                        var show_name = list_name.slice(0,list_name.lastIndexOf("~"));
                        saveLastCookie.push("<li class='"+unescape(this.searchNeedCookie[tt][0])+"'><a href='javascript:void(0)'>"+show_name+"</a></li>");

                    } else {
                        this.delCookie(this.searchNeedCookie[tt][0]);
                    }
                }
            } else if(this.searchNeedCookie.length) {
                for(var tt=0;tt < this.searchNeedCookie.length;tt++) {
                    var list_name =unescape(this.searchNeedCookie[tt][1]);
                    var show_name = list_name.slice(0,list_name.lastIndexOf("~"));
                    saveLastCookie.push("<li class='"+unescape(this.searchNeedCookie[tt][0])+"'><a href='javascript:void(0)'>"+show_name+"</a></li>");
                }
            }
        } else {
            if(this.searchNeedCookie.length >=6) {
                for(var tt=1;tt<=this.searchNeedCookie.length;tt++) {
                    if(tt < 7) {
                        cc = this.searchNeedCookie.length - tt;
                        var list_name =unescape(this.searchNeedCookie[cc][1]);
                        var show_name = list_name.slice(0,list_name.lastIndexOf("~"));
                        saveLastCookie.push("<li class='"+unescape(this.searchNeedCookie[cc][0])+"'><a href='javascript:void(0)'>"+show_name+"</a></li>");
                    } else {
                        this.delCookie(this.searchNeedCookie[cc][0]);
                    }
                }
            } else if(this.searchNeedCookie.length) {
                for(var tt=1;tt<=this.searchNeedCookie.length;tt++) {
                    cc = this.searchNeedCookie.length - tt;
                    var list_name =unescape(this.searchNeedCookie[cc][1]);
                    var show_name = list_name.slice(0,list_name.lastIndexOf("~"));
                    saveLastCookie.push("<li class='"+unescape(this.searchNeedCookie[cc][0])+"'><a href='javascript:void(0)'>"+show_name+"</a></li>");
                }
            }
        }
        if(this.searchNeedCookie.length > 0) {
            saveLastCookie.push("<li><input type='button' class='close-btn' id='closeBtn' value='关闭' /><input type='button'"+
                                "class='empty-history' id='emptyHistory' value='清空历史记录'/></li>");
        }
        return saveLastCookie;
    }

    /**
     * 底部搜索框各种绑定事件
     *
     */
    Cookie.prototype.initBottom = function() {
        var self = this,
        doCookie = document.getElementById('doCookie'),
        suggest  = document.getElementById('suggest');

        $('.search-key').on('click',function(){
            // 去除空格
            isSearchVal = $('#searchCont').val().replace(/\s/g,'');
            if(isSearchVal !=''){
                var searchContVal = $('#searchCont').val();
                var lastSixCookie = new Array([]);
                    lastSixCookie = self.getLastSixCookie1();
                var temp = true;
                lastSixCookie.forEach(function(m,k) {
                    if("<li><a href='javascript:void(0)'>"+searchContVal+"</a></li>" == m ){
                        temp =  false;
                    }
                });

                if(temp && searchContVal) {
                    this.isUpdateCookie = true;
                    searchContVal = searchContVal.replace(/\s/g,'');

                    self.setCookie('',searchContVal,100,0);
                }

                // 拼接搜索地址
                var q = searchContVal;
                var url = $('#cosUrlsearch').val();
                var citylett = $('#cosUrlCity').val();
                var currentProductType = $('#currentProductType') ? $('#currentProductType').val() : "";
                //搜索值
                url=url+"/q/"+q;
                //出发城市
                url=url+"/city/"+citylett;
                //分页，默认1
                url=url+"/p/"+1;
                if(currentProductType == 4) {
                    url = url+"/Sort-default/xc_day-/proSpeVal-/minPrice-/maxPrice-/Flag-/fun-" + 4;
                }

                window.location.href=url;
            }
        });


        $('#searchCont').on('focus',function(){
            // 聚焦后搜索框移到页面顶部
            setTimeout("window.scrollBy(0,document.getElementById('searchCont').getBoundingClientRect().top-120)",0);
            $('#searchCont').css('color','#333');

            // 如果搜索框里有默认值
            if(self.defaultTemp) {
                self.defaultVal = this.value;
                self.defaultTemp = false;
            }

            // 去除空格
            if(this.value.replace(/\s/g,'') === '') {
                this.value = '';
            }

            if(this.isUpdateCookie){
                this.isUpdateCookie = false;
            }
            else{
                //return false;
            }

            saveLastCookies = self.getLastSixCookie1();
            doCookie.innerHTML = saveLastCookies.join("");
            doCookie.style.display = 'block';
            suggest.style.display = 'none';

            //在这个循环里绑定清除事件,现在循环直接循环到length
            for(var tk=0; tk < doCookie.children.length; tk++) {

                var nowChildNode = doCookie.children[tk];
                //如果是最底下那个li
                if(tk == doCookie.children.length-1) {
                    // 点击关闭按钮
                    nowChildNode.children[0].onclick = function() {
                        doCookie.style.display = 'none';
                    };

                    /**
                     * 清除浏览记录
                     *
                     */
                    nowChildNode.children[1].onclick = function(){  //清除记录按钮节点
                        //有历史记录才清除
                        if(self.searchNeedCookie.length > 0){
                            for(var t = 0;t < self.searchNeedCookie.length; t++) {
                                //循环清除
                                self.delCookie(self.searchNeedCookie[t][0]);
                            }
                            doCookie.style.display = 'none';
                            //把里边设置成空的html代码
                            doCookie.innerHTML = '';
                        }
                    }
                } else {
                    // 如果不是最下面一个li标签
                    nowChildNode.onclick = function() {
                        var searchVal = "";
                        if(this.children[0].innerHTML) {
                            searchVal = this.children[0].innerHTML;
                            var cook_name = this.getAttribute('class');
                            //重新设置cookie
                            self.setCookie(cook_name,searchVal,100,1);
                            self.searchByHistory(searchVal);
                        }
                    };
                }
            }
        });

        $('#searchCont').on('input',function() {
            var searchSuggestAjax = document.getElementById('searchSuggestAjax').value;
            var q = $('#searchCont').val();
            var citylett = document.getElementById("cosUrlCity").value;

            $('#doCookie').css('display','none');
            $('#suggest').css('display','block');

            $.ajax({
                type: 'GET',
                dataType: 'json',
                url: searchSuggestAjax + '?data={"q":"' + q +
                '", "limit":"6","beginCityCode": "'+ citylett +'" ," curPage":"1"}',
                success: function(data) {
                    console.debug(data);
                    if(data) {
                        var  str = '';
                        for(var pl=0; pl < 6; pl++) {
                            if(data[pl]){
                                str += ("<li><a href='javascript:void(0)'>"+data[pl]+"</a></li>");
                            }else{
                                console.debug(123);
                            }

                        }

                        suggest.innerHTML = str;

                        var count = suggest.children;
                        for(var i=0;i<count.length;i++) {
                            var nowChild = suggest.children[i];
                            nowChild.onclick = function() {
                                //HTML值
                                var p = this.children[0].innerHTML;
                                if(p) {
                                    var url = document.getElementById("cosUrlsearch").value;
                                    var citylett = document.getElementById("cosUrlCity").value;
                                    //搜索值
                                    url=url+"/q/"+p;
                                    //出发城市
                                    url=url+"/city/"+citylett;
                                    url=url+"/p/"+1;
                                    window.location.href=url;
                                    var searchVal = "";
                                    searchVal = this.children[0].innerHTML;
                                    var cook_name = this.getAttribute('class');
                                    //重新设置cookie
                                    self.setCookie("",searchVal,100,0);
                                }
                            };
                        }
                    }
                },
                error: function(error) {
                    console.error(error);
                }
            });
        });

        $('document').on('click',function(){
            if(suggest) {
                suggest.style.display = 'none';
            }
        });
    }

    /**
     * 拼接跳转地址
     *
     */
    Cookie.prototype.changeURLmainPage = function() {
        var key_word = document.getElementById("searchCont").value;
        if(key_word != ""){
         this.setCookie('',key_word,100,0);
        }
        var q = document.getElementById('searchCont').value;
        var url = document.getElementById("cosUrlsearch").value;
        var citylett = document.getElementById("cosUrlCity").value;

        var currentProductType = document.getElementById("currentProductType") ? document.getElementById("currentProductType").value : "";
        //搜索值
        url=url+"/q/"+q;
        //出发城市
        url=url+"/city/"+citylett;
        //分页，默认1
        url=url+"/p/"+1;
        if(currentProductType == 4) {
            url = url+"/Sort-default/xc_day-/proSpeVal-/minPrice-/maxPrice-/Flag-/fun-" + 4;
        }
        window.location.href=url;
    }

})
