

/*
@serializeObject 
@demo 
[
$.ajax({
                    url: me.url.saveUrl,
                    data: JSON.stringify( data.entity ),
                    contentType: 'application/json',
                    dataType: "json",
                    type: 'post',
                    error: function (result) {
                    },
                    success: function (result) {
                        
                    }
                });
]
*/
$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
