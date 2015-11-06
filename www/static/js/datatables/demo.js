+function ($) {
    "use strict";
var oTable;
    $(function () {

        oTable = initTable();
    });
        // datatable
        function initTable() {
            var table =  $('[data-ride="datatables"]').dataTable({
                "bProcessing": true,
                "serverSide": true,
                //"ajax": "/static/js/datatables/datatable.json",
                "ajax": "/admin/user/userlist",
                "sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>",
                "sPaginationType": "full_numbers",
                "bSort": false,
                "aoColumnDefs": [

                    {
                        "mRender": function (data, type, row) {

                            return '<a href="#" class="active" data-toggle="class"><i class="fa fa-check text-success text-active"></i><i class="fa fa-times text-danger text"></i></a>';
                        }, "bSortable": false, "aTargets": [7]
                    },
                    {
                        "mRender": function (data, type, row) {

                            return '<a class="btn btn-default btn-xs" href="#'+data+'">编辑</a> <a class="btn btn-default btn-xs" href="#">删除</a>';
                        }, "bSortable": false, "aTargets": [8]
                    },
                    {
                        "mRender": function (data, type, row) {

                            return '<label class="checkbox m-n i-checks"><input type="checkbox" name="post[]"><i></i></label>';
                        },
                        'bSortable': false,
                        "aTargets": [0]
                    },
                ],
                "aoColumns": [
                    {"mData": ""},
                    {"mData": "id"},
                    {"mData": "username"},
                    {"mData": "score"},
                    {"mData": "login"},
                    {"mData": "last_login_time"},
                    {"mData": "last_login_ip"},
                    {"mData": "status"},
                    {"mData": "id"}
                ],
                language: {
                    "sProcessing": "处理中...",
                    "sLengthMenu": "显示 _MENU_ 项结果",
                    "sZeroRecords": "没有匹配结果",
                    "sInfo": "显示第 _START_ 至 _END_ 位会员，共 _TOTAL_ 位",
                    "sInfoEmpty": "显示第 0 至 0 项结果，共 0 项",
                    "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
                    "sInfoPostFix": "",
                    "sSearch": "搜索:",
                    "sUrl": "",
                    "sEmptyTable": "表中数据为空",
                    "sLoadingRecords": "载入中...",
                    "sInfoThousands": ",",
                    "oPaginate": {
                        "sFirst": "首页",
                        "sPrevious": "上页",
                        "sNext": "下页",
                        "sLast": "末页"
                    },
                    "oAria": {
                        "sSortAscending": ": 以升序排列此列",
                        "sSortDescending": ": 以降序排列此列"
                    }
                }
            });
            return table;
        };

        $('#growthrate').length && $.ajax('js/datatables/growthrate.csv').done(function (re) {
            var data = $.csv.toArrays(re);
            $('#growthrate').html('<table cellpadding="0" cellspacing="0" border="0" class="table table-striped m-b-none" id="example"></table>');
            $('#example').dataTable({
                "aaData": data,
                "bProcessing": true,
                "sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>r>t<'row'<'col-sm-6'i><'col-sm-6'p>>",
                "iDisplayLength": 50,
                "sPaginationType": "full_numbers",
                "aoColumnDefs": [
                    {"bSearchable": false, "bVisible": false, "aTargets": [1]},
                    {"bVisible": false, "aTargets": [4]},
                    {
                        "mRender": function (data, type, row) {
                            return data + ' ' + '%';
                        },
                        "aTargets": [5]
                    },
                    {
                        "mRender": function (data, type, row) {

                            return '<i class="fa ' + (row[5] > 0 ? 'fa-sort-up text-success' : 'fa-sort-down text-danger') + '"></i>';
                        },
                        'bSortable': false,
                        "aTargets": [6]
                    },
                ],
                "aoColumns": [
                    {"sTitle": "Country or Area"},
                    {"sTitle": "Subgroup"},
                    {"sTitle": "Year"},
                    {"sTitle": "source", "sClass": "center"},
                    {"sTitle": "Unit", "sClass": "center"},
                    {"sTitle": "Value", "sClass": "center"},
                    {"sTitle": "", "sClass": "center"}
                ]
            });
        });


        $('#register #btn').on('click', function () {
            $('#register').parsley().validate();
            if (true === $('#register').parsley().isValid()) {
               _addFun();
            }
            return false;
        });

        function _addFun() {
            var jsonData = {
                'username': $("input[name='username']").val(),
                'password': $("input[name='password']").val(),
                'email': $("input[name='email']").val()
            };
            $.ajax({
                url: "/admin/user/adduser",
                data: jsonData,
                type: "post",
                success: function (backdata) {
                    if (backdata == 1) {
                        //$("#myModal").modal("hide");
                        resetFrom();
                        oTable.fnReloadAjax(oTable.fnSettings());
                    } else if (backdata == 0) {
                        alert("插入失败");
                    } else {
                        alert("防止数据不断增长，会影响速度，请先删掉一些数据再做测试");
                    }
                }, error: function (error) {
                    console.log(error);
                }
            });
        }

        /**
         * 重置表单
         */
        function resetFrom() {
            $('form').each(function (index) {
                $('form')[index].reset();
            });
        }
        /*
         add this plug in
         // you can call the below function to reload the table with current state
         Datatables刷新方法
         oTable.fnReloadAjax(oTable.fnSettings());
         */
        $.fn.dataTableExt.oApi.fnReloadAjax = function (oSettings) {
//oSettings.sAjaxSource = sNewSource;
            this.fnClearTable(this);
            this.oApi._fnProcessingDisplay(oSettings, true);
            var that = this;

            $.getJSON(oSettings.sAjaxSource, null, function (json) {
                /* Got the data - add it to the table */
                for (var i = 0; i < json.aaData.length; i++) {
                    that.oApi._fnAddData(oSettings, json.aaData[i]);
                }
                oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
                that.fnDraw(that);
                that.oApi._fnProcessingDisplay(oSettings, false);
            });
        }

}(window.jQuery);