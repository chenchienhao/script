AJS.$(document).ready(function () {
    console.log("timeline_template.js on loading...");
    /* Inicializacion de CANVAS */
    var cav = document.createElement('canvas')
    cav.setAttribute("id", "canv");
    var context = cav.getContext("2d");
    var margin_timeline = 40;
    /* Inicializacion de FECHA */
    var range_d_ok = 90;
    var d = new Date();
    var month = d.getMonth()+1;
    var day = d.getDate();
    var past_month = month-1;
    var future_month = month+2;
    var past_year = d.getFullYear();
    var future_year = d.getFullYear();
    if(past_month <= 0){
      past_month += 12;
      past_year -=1;
    }
    if(future_month > 12){
      future_month -= 12;
      past_year +=1;
    }
    var past_d = "";
    var current_d = day+'/'+month+'/'+d.getFullYear();
    var future_d = "";
    var current_d_line_position = (AJS.$(window).width()/3);
    var range_d_ok_line_position = (AJS.$(window).width()/3)*2;
    var new_canvas = redraw(cav,context);
    cav = new_canvas[0];
    context = new_canvas[1];
    global_main_div.appendChild(cav);
    global_gadget.getView().html(global_main_div);
    global_gadget.resize();
    console.log("done...");

    function treatAsUTC(date_s) {
      var treatAsUTCb = date_s.split(/\D/);
      return new Date(Date.UTC(treatAsUTCb[2], treatAsUTCb[1]-1, treatAsUTCb[0]));
    }
    function daysBetween(startDate, endDate) {
      var millisecondsPerDay = 24 * 60 * 60 * 1000;
      return (treatAsUTC(endDate) - treatAsUTC(startDate)) / millisecondsPerDay;
    }
    function create_canvas(c,ctx){
        /* Tamaño de la caja de CANVAS */
        var cw = c.width = AJS.$(window).width(),
          cx = cw / 2;
        var ch = c.height = 125,
          cy = ch / 1.5;
        /* Punto Inicial y Final del TimeLine */
        var a = {
          x: 5+margin_timeline,
          y: 50,
          text: past_d
        }
        var b = {
          x: AJS.$(window).width()-5-margin_timeline,
          y: 50,
          text: future_d
        }
        /* Leyendas de Pie de Grafico */
        var pie = {
          x: 0,
          y: 105,
          color: "#ededea"
        }
        var ms_status = [{
            x: margin_timeline,
            y: 114,
            color: "#26f700",
            text: "MS Finalizado en fecha"
          },{
            x: margin_timeline+130,
            y: 114,
            color: "#f9ff33",
            text: "MS Finalizado con retraso"
          },{
            x: current_d_line_position+5,
            y: 114,
            color: "#00008b",
            text: "MS Sin riesgo"
          },{
            x: current_d_line_position+85,
            y: 114,
            color: "#e74c3c",
            text: "MS Con riesgo"
          },{
            x: range_d_ok_line_position+5,
            y: 114,
            color: "#00ffff",
            text: "MS Comprometido a Negocio"
          },{
            x: range_d_ok_line_position+145,
            y: 114,
            color: "#cfcfc5",
            text: "MS TBC"
          },{
            x: range_d_ok_line_position+205,
            y: 114,
            color: "#e74c3c",
            text: "MS Comprometido en Riesgo"
        }];
        /* Dibujo Leyendas de Pie */
        ctx.beginPath();
        ctx.fillStyle = pie.color;
        ctx.moveTo(pie.x, pie.y);
        ctx.lineTo(AJS.$(window).width(),pie.y);
        ctx.lineTo(AJS.$(window).width(),pie.y+20);
        ctx.lineTo(pie.x,pie.y+20);
        ctx.fill();
        for (var i = 0; i<ms_status.length; i++){
          ctx.beginPath();
          ctx.fillStyle = ms_status[i].color;
          ctx.arc(ms_status[i].x, ms_status[i].y, 6, 0, 2 * Math.PI);
          ctx.fill();
          ctx.font = "8px Verdana";
          ctx.fillStyle = "#000000";
          ctx.fillText(ms_status[i].text, ms_status[i].x+10, ms_status[i].y + 5);
        }
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(current_d_line_position, 0);
        ctx.lineTo(current_d_line_position, 110);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(range_d_ok_line_position, 0);
        ctx.lineTo(range_d_ok_line_position, 110);
        ctx.stroke();
        ctx.setLineDash([]);
        /* Dibuja Linea base de Tiempo */
        ctx.beginPath();
        ctx.moveTo(a.x-margin_timeline, a.y);
        ctx.lineTo(b.x+margin_timeline, b.y);
        ctx.stroke();
        /* Escribe Texto Inicial y Final de la Linea Base de Tiempo */
        ctx.font = "10px Verdana";
        ctx.fillStyle = "blue";
        ctx.fillText(a.text, a.x, a.y - 5);
        ctx.fillText(b.text, b.x-70, b.y - 5);

        return [c,ctx];
    }
    function addDays (days) {
      var date = new Date();
      date.setDate(date.getDate() + days);
      return formatDate(date);
    }
    function formatDate(date) {
      var format_date = "";
      var format_date_day = date.getDate();
      var format_date_month = date.getMonth()+1;
      var format_date_year = date.getFullYear();

      if(date.getDate()<10)
        format_date_day = '0'+format_date_day.toString();

      if(date.getMonth()<10)
        format_date_month = '0'+(date.getMonth()+1).toString();

      format_date = format_date_day + '/' + format_date_month + '/' + format_date_year;

      return format_date;
    }
    function compareDate(date1, date2){
      var date1_day = Number(date1.slice(0,date1.indexOf("/")));
      var date2_day = Number(date2.slice(0,date2.indexOf("/")));
      var date1_month = Number(date1.slice(date1.indexOf("/")+1,date1.lastIndexOf("/")))*100;
      var date2_month = Number(date2.slice(date2.indexOf("/")+1,date2.lastIndexOf("/")))*100;
      var date1_year = Number(date1.substr(date1.lastIndexOf("/")+1))*10000;
      var date2_year = Number(date2.substr(date2.lastIndexOf("/")+1))*10000;

      if((date1_day+date1_month+date1_year)>(date2_day+date2_month+date2_year))
        return true;
      else
        return false;
    }
    function addMileStone(ms,past_d,future_d,current_d_line_position,range_d_ok_line_position,node_space_sum,initial_point,ctx){
        var allcase_statusmilestone = ["finalizado en fecha", "finalizado con retraso", "sin riesgo", "con riesgo", "comprometido", "tbc", "comprometido en riesgo"];
        var all_month = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
        var allcase_capturavalor = ["si","no"];
        var statusmilestone_color = "";
        var tipodemilestone_label = "";
        var tipodemilestone_label_date = "";
        var date_position = ms.enddate;
        var ms_position = 0;

        ms_position = initial_point+node_space_sum;

        ms.x = ms_position;
        ms.y = 50;
        tipodemilestone_label = ms.tipodemilestone.substr(0, ms.tipodemilestone.indexOf(" - "));
        tipodemilestone_label_date = date_position.substr(0, date_position.indexOf("/")+1)+all_month[Number(date_position.slice(date_position.indexOf("/")+1, date_position.lastIndexOf("/")))-1];

        if(ms.statusmilestone.toLowerCase() == allcase_statusmilestone[0])
          statusmilestone_color = "#26f700";
        else if(ms.statusmilestone.toLowerCase() == allcase_statusmilestone[1])
          statusmilestone_color = "#f9ff33";
        else if(ms.statusmilestone.toLowerCase() == allcase_statusmilestone[2])
          statusmilestone_color = "#00008b";
        else if(ms.statusmilestone.toLowerCase() == allcase_statusmilestone[3])
          statusmilestone_color = "#e74c3c";
        else if(ms.statusmilestone.toLowerCase() == allcase_statusmilestone[4])
          statusmilestone_color = "#00ffff";
        else if(ms.statusmilestone.toLowerCase() == allcase_statusmilestone[5])
          statusmilestone_color = "#cfcfc5";
        else if(ms.statusmilestone.toLowerCase() == allcase_statusmilestone[6])
          statusmilestone_color = "#e74c3c";

        ctx.beginPath();
        ctx.fillStyle = statusmilestone_color;
        if(ms.capturavalor.toLowerCase() == allcase_capturavalor[0]){
          ctx.moveTo(ms.x, ms.y-7);
          ctx.lineTo(ms.x+7,ms.y+7);
          ctx.lineTo(ms.x-7,ms.y+7);
        }
        else{
          ctx.arc(ms.x, ms.y, 6, 0, 2 * Math.PI);
        }
        ctx.fill();
        ctx.font = "10px Verdana";
        ctx.fillStyle = "#000000";
        ctx.fillText(tipodemilestone_label, ms.x-6, ms.y+22);
        ctx.fillText(tipodemilestone_label_date, ms.x-18, ms.y+35);
    }
    function classificateMilestone(ms,past_d,future_d){
        var date_position = ms.enddate;
        var today = formatDate(new Date());
        var case_milestone = 0;

        if(compareDate(today,ms.enddate)){
            case_milestone = 1;
        }
        else if ((compareDate(ms.enddate,today) && compareDate(addDays(range_d_ok),ms.enddate))||(ms.enddate==today)){
            case_milestone = 2;
        }
        else if (compareDate(ms.enddate,addDays(range_d_ok))||(ms.enddate==addDays(range_d_ok))){
            case_milestone = 3;
        }
        return case_milestone;
    }
    function sortArrayMilestoneByDate(ms){
        var ms_array_sort = [];
        ms_array_sort = quickSort(ms,0,ms.length-1);
        return ms_array_sort;
    }
    function quickSort(arr, left, right){
        var len = arr.length,
        pivot,
        partitionIndex;
        if(left < right){
            pivot = right;
            partitionIndex = partition(arr, pivot, left, right);
           quickSort(arr, left, partitionIndex - 1);
           quickSort(arr, partitionIndex + 1, right);
        }
      return arr;
    }
    function partition(arr, pivot, left, right){
       var pivotValue = arr[pivot].enddate,
           partitionIndex = left;

       for(var i = left; i < right; i++){
          if(compareDate(pivotValue,arr[i].enddate)){
            swap(arr, i, partitionIndex);
            partitionIndex++;
          }
      }
      swap(arr, right, partitionIndex);
      return partitionIndex;
    }
    function swap(arr, i, j){
       var temp = arr[i];
       arr[i] = arr[j];
       arr[j] = temp;
    }
    function redraw(c,ctx) {
        ctx.clearRect(0, 0, AJS.$( window ).width, AJS.$( window ).height);
        limiteDate();
        var new_canvas =create_canvas(c,ctx);
        c = new_canvas[0];
        ctx = new_canvas[1];
        current_d_line_position = (AJS.$(window).width()/3);
        range_d_ok_line_position = (AJS.$(window).width()/3)*2;

        var array_milestone_case = [[],[],[]];
        for(var i=0; i<3; i++)
            array_milestone_case[i] = [];

        for (var i = 0; i<global_milestone_array.length; i++){
            switch(classificateMilestone(global_milestone_array[i],past_d,future_d)){
                case 0:
                    console.log("error: cant find out case for milestone..."+global_milestone_array[i]);
                    break;
                case 1:
                    array_milestone_case[0].push(global_milestone_array[i]);
                    break;
                case 2:
                    array_milestone_case[1].push(global_milestone_array[i]);
                    break;
                case 3:
                    array_milestone_case[2].push(global_milestone_array[i]);
                    break;
            }
        }
        for (var i = 0; i<3; i++)
            array_milestone_case[i] = sortArrayMilestoneByDate(array_milestone_case[i]);

        if(array_milestone_case[0].length>4){
            //Se realiza el filtro para el caso milestone pasado.
            var array_milestone_case_0 = [];
            array_milestone_case_0.push(array_milestone_case[0][0]);
            array_milestone_case_0.push(array_milestone_case[0][array_milestone_case[0].length-3]);
            array_milestone_case_0.push(array_milestone_case[0][array_milestone_case[0].length-2]);
            array_milestone_case_0.push(array_milestone_case[0][array_milestone_case[0].length-1]);
            array_milestone_case[0] = array_milestone_case_0;
        }

        var node_space = 0;
        var initial_point = 0;
        for (var i = 0; i<3; i++){
            var node_space_sum = 0;
            switch(i){
                case 0:
                    initial_point = margin_timeline;
                    node_space = ((AJS.$(window).width()/3)-margin_timeline)/(array_milestone_case[i].length+1);
                    break;
                case 1:
                    initial_point= (AJS.$(window).width()/3);
                    node_space = (AJS.$(window).width()/3)/(array_milestone_case[i].length+1);
                    break;
                case 2:
                    initial_point= (AJS.$(window).width()/3)*2;
                    node_space = ((AJS.$(window).width()/3)-margin_timeline)/(array_milestone_case[i].length+1);
                    break;
            }
            for (var j = 0; j<array_milestone_case[i].length; j++){
                switch(i){
                    case 0:
                        node_space_sum += node_space;
                        addMileStone(array_milestone_case[i][j],past_d,future_d,current_d_line_position,range_d_ok_line_position,node_space_sum,initial_point,context);
                        break;
                    case 1:
                        node_space_sum += node_space;
                        addMileStone(array_milestone_case[i][j],past_d,future_d,current_d_line_position,range_d_ok_line_position,node_space_sum,initial_point,context);
                        break;
                    case 2:
                        node_space_sum += node_space;
                        addMileStone(array_milestone_case[i][j],past_d,future_d,current_d_line_position,range_d_ok_line_position,node_space_sum,initial_point,context);
                        break;
                }
            }
        }
        return [c,ctx];
    }
    function limiteDate(){
      var first_milestone_ = "01/01/9999";
      var last_milestone_ = "01/01/1111";
      for (var i = 0; i<global_milestone_array.length; i++){
        if(compareDate(first_milestone_,global_milestone_array[i].enddate))
          first_milestone_ = global_milestone_array[i].enddate;
        if(compareDate(global_milestone_array[i].enddate,last_milestone_))
          last_milestone_ = global_milestone_array[i].enddate;
      }
      past_d=first_milestone_;
      future_d=last_milestone_;
    }
});