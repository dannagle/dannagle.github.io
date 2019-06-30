
var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};

function escapeHtml(string) {
return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
});
}

function sortByKeys(array, key1, key2) {
    return array.sort(function(a, b) {
        var x = a[key1]; var y = b[key1];
        if(x == y) {
            x = a[key2]; y = b[key2];
        }
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function bindAbstracts() {
    $(".abstract").click(function(){
        var data = $(this).attr("data-abstract");
        //console.log(data);
        $(this).parent().html(data);

        return false;



    });

}

function bindTags() {
    $(".talktag").click(function(){
        var tagval1 = $(this).attr("data-tagval1");
        var addhighlight = !$(this).hasClass("talktaghighlight");
        var tagvalcheck = $(this).attr("data-tagval1");
        if(addhighlight) {
            console.log("need to add highlight from " + tagvalcheck);
            $('*[data-tagval1="'+tagvalcheck+'"]').addClass("talktaghighlight");
        } else {
            console.log("need to remove highlight from " + tagvalcheck);
            $('*[data-tagval1="'+tagvalcheck+'"]').removeClass("talktaghighlight");
        }
        return false;
    });
}

function viewAll() {

    $(".abstract").each(function(){
        var data = $(this).attr("data-abstract");
        //console.log(data);
        $(this).parent().html(data);
    });

    $("#showAll").remove();
    return false;

}

function viewAllTags() {

    $(".talktagtop").each(function(){
        $(this).removeClass("hidden");
        $(this).removeClass("hidden-mobile");
    });

    $("#showAllTags").remove();
    return false;

}

$(document).ready(function(){

    $("#showAll").click(viewAll);
    $("#showAllTags").click(viewAllTags);

    var uniquetags = [];
    var tagmax = -1;


    $.getJSON( "session2018.json", function( data ) {
        for(var i=0; i<data.length; i++) {
            data[i].StartTime = data[i].TimeSlot.StartTime;
            if(data[i].StartTime !== null) {
                data[i].DisplayDateTime = data[i].TimeSlot.DisplayDateTime;
            } else {
                data[i].DisplayDateTime = "Unassigned";
            }
        }
        var items = sortByKeys(data, "StartTime", "Room");

        var lastTimeSlot = "asdfasdf";
        var rowbuilder = "";
        var extlink = ''
        var extlinkunicode = '&#x279A;'
        var extlinkimg =  '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAABi0lEQVRIS9WW33GDMAzGLWCAdBN6Ns8NG3SEdoNkgrQTpJ2g2aAjtO9g6hGyQRkAUE85zDnmnw3Xh/CKpB/6rE8GmOMjhNgi4pdjuB2mwCeRc/7BGHvyydGxXiBKWgrzBi2F9UBxHG+iKIqH5Kmq6qyUOrewT8bYo6uMF1Bb/ICIpP9mJLkMgiDNskwlSRI3TUODMRbbKwEECcOQkga7aDNWQagGCCGOiLibkGA15ALinP8aEigA2Od5/m2Dl8hl1iAQdrMOkP4HRHfUgaSUvSlc20nXhNnREGihQUn67ah0IyCayKukKe8g4nNRFCf7A6/OaAgkhHhBxIOLMTVEx5qwWZCjz5iGULxSqrRhsyC9OaZMbUIoTkp5bypAV4wTaApmQ2jDDB2BM8jYiTtEfGCMlQDwrn3HOf/Ra2w1aGog5mzi1dHtgWBk1815yP5xGTuj3vaeK2y/R8SjcZ+VUso7O8blPvLiAsBbnuf7HsjV+Y40Vdd1am6Gbnt7/DNMschTp6qqXocglPgH46wKvvBUSK4AAAAASUVORK5CYII=">';

        //console.log(items);
        var rowcounter = 0;
        $.each( items, function( key, val ) {

            rowcounter++;
            var classtext = " class='altrow' ";
            rowbuilder = "";
            if(lastTimeSlot != val.StartTime) {
                rowbuilder = "<tr style='background:#384452'><td colspan='3'></td></tr>";
            }

            if((rowcounter % 2) == 0) {
                classtext = "";
            }

            lastTimeSlot = (val.StartTime);
            rowbuilder += "<tr "+classtext+" ><td>";
            //rowbuilder += val.Id + "</td><td>";
            rowbuilder += "<a target='_blank' href='"+ "https://www.devspaceconf.com/speakers.html?id=" + val.Speaker.Id + "'>" + val.Speaker.DisplayName + "</a>";
            if(val.Room !== null) {
                rowbuilder += "<br>"+ val.Room + "</td><td>";
            } else {
                rowbuilder += "<br>Room: Unassigned</td><td>";
            }
            rowbuilder += "<a target='_blank' href='"+ "https://www.devspaceconf.com/sessions.html?id=" + val.Id + "'>" + val.Title + extlink + "<br><div><br><a data-abstract='"+escapeHtml(val.Abstract)+"' class='abstract' href='#'>View Abstract</a></div></td><td class='timeandtags'>";
            rowbuilder += val.DisplayDateTime + "<BR>";
            var tagbuilder = "";
            $.each( val.Tags, function( key1, val1 ) {
                tagbuilder += " <span class='talktag' data-tagval1='"+val1.Id+"'>" + val1.Text + "</span>";

                if(val1.Id > tagmax) {
                    tagmax = val1.Id;
                }

                if(uniquetags[val1.Id]) {
                    uniquetags[val1.Id]["count"]++;
                    uniquetags[val1.Id]["title"] = uniquetags[val1.Id]["title"] + "\n" + val.Title;
                } else {
                    uniquetags[val1.Id] = {};
                    uniquetags[val1.Id]["count"] = 1;
                    uniquetags[val1.Id]["text"] = val1.Text;
                    uniquetags[val1.Id]["id"] = val1.Id;
                    uniquetags[val1.Id]["title"] = val.Title;
                }

            });
            rowbuilder += tagbuilder;
            rowbuilder += "</td></tr>"

            //console.log(rowcounter, rowbuilder);
            $("#speaktable").append(rowbuilder);
        });


        var keys = Object.keys(uniquetags);
        console.log("uniquetags", uniquetags);
        console.log("keys", keys);
        console.log("tagmax", tagmax);

        var tagArray = [];
        for(var index = 1; index <= tagmax; index++ ) {
            if(uniquetags[index]) {
                tagArray.push(uniquetags[index]);
            }
        }

        console.log("tagArray", tagArray);

        tagArray.sort(function(a, b) {
            return b["count"] - a["count"];
        });



        var tagcounter = 0;
        tagArray.forEach(function(tg) {

            //console.log("tg", tg);

            var title = tg["title"].replace("'", "");

            tagcounter++;
            var tagclass = "";
            if(tagcounter > 10) {
                tagclass = " hidden ";
            }

            tagbuilder = " <span title='"+title+"' class='hidden-mobile talktag talktagtop "+tagclass+"' data-tagval1='"+tg["id"]+"'>" + tg["text"] + " ("+ tg["count"] +")" + "</span>";
            $("#tagsearch").html($("#tagsearch").html() + tagbuilder);
        });

        bindAbstracts();
        bindTags();

    });




});
