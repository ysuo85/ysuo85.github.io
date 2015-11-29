/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function(){
    var path = window.location.pathname;
    var page = path.split('/').pop();
    var pagefolder = page.replace(".html","");
    var CSS_LAYOUT = "/layout.css";
    var CSS_COLORS_FONTS = "/colors_fonts.css";
    loadCSS("css/" + pagefolder + CSS_LAYOUT);
    loadCSS("css/" + pagefolder + CSS_COLORS_FONTS);        
    $.ajaxSetup({beforeSend: function(xhr){
        if (xhr.overrideMimeType){
            xhr.overrideMimeType("application/json");
        }
    }
    });
    
    $.getJSON("data/" + pagefolder + "/site_data.json", function(jd){
        loadNavbarFromJSON(jd);
        loadBannerFromJSON(jd);
        loadBannerImageFromJSON(jd, page);
        loadContentFromJSON(jd);
        loadFooterFromJSON(jd);
    }).fail( function(d, textStatus, error) {
        console.error("getJSON failed, status: " + textStatus + ", error: "+error);
    });
});
            
function loadNavbarFromJSON(jd){
    for(var key in jd.navbar_links){
        var link = $('<a href="' + jd.navbar_links[key] + '">' + key + '</a>');
            $("#navbar").append(link);   
    }                
}
            
function loadBannerFromJSON(jd){
    var name = jd.student.first_name + " " + jd.student.middle_initial
    + " " + jd.student.last_name;
    var banner_string = "<h1>" + jd.banner + "</h1>";
    var banner_string = banner_string.replace('%name%', name);
    $("#banner").append(banner_string);
}

function loadBannerImageFromJSON(jd, page){
    var banner_image = $('#banner_img');
    var image = null;
    if(jd.hasOwnProperty('banner_image')){
        image = jd.banner_image;
    }
    if(image !== null){
        banner_image.attr('src', image.src);
        banner_image.attr('width', image.width);
        banner_image.attr('height', image.height);        
    }
}

function loadContentFromJSON(jd){
    var components_arr = jd.components;
    for(var i = 0;i < components_arr.length;i++){
        if(components_arr[i].type === "header"){
            processHeaderComponent(components_arr[i], jd);
        }
        else if(components_arr[i].type === "paragraph"){
            processParagraphComponent(components_arr[i], jd);
        }
        else if(components_arr[i].type === "list"){
            processListComponent(components_arr[i]);
        }
        else if(components_arr[i].type === "image"){
            processImageComponent(components_arr[i]);
        }
        else if(components_arr[i].type === "slideshow"){
            processSlideshowComponent(components_arr[i]);
        }
        else if(components_arr[i].type === "video"){
            processVideoComponent(components_arr[i]);
        }
    }
}

function loadFooterFromJSON(jd){
    $('#footer').append(jd.footer);
}

function processHeaderComponent(header, jd){
    var content = header.content;
    var id = header.id;
    for(var e in jd.hyper_links){
        var length_offset = 0;
        if(header.id === e.component_id){
            for(var f in jd.hyper_links[e].links){
                var currentLink = jd.hyper_links[e].links[f];
                var old_content = content;
                content = parseHyperLinks(content, currentLink.url, currentLink.starting_index + length_offset, currentLink.ending_index + length_offset);
                length_offset += (content.length - old_content.length);
            }
        }
    }
    var wrapped_content = $('<h1 class="component header">' + content + '</h1>');
    $("#content").append(wrapped_content);
}

function processParagraphComponent(paragraph, jd){
    var content = paragraph.content;
    var id = paragraph.id;
    for(var e in jd.hyper_links){
        var length_offset = 0;
        if(paragraph.id === jd.hyper_links[e].component_id){
            for(var f in jd.hyper_links[e].links){
                var currentLink = jd.hyper_links[e].links[f];
                var old_content = content;
                content = parseHyperLinks(content, currentLink.url, currentLink.starting_index + length_offset, currentLink.ending_index + length_offset);
                length_offset += (content.length - old_content.length);
            }
        }
    }    
    var wrapped_content = $('<p class="component paragraph">' + content + '</p>');
    $("#content").append(wrapped_content);
}

function processListComponent(list){
    var content = $('<ul class="component list">');
    for(var i = 0;i < list.content.length;i++){
        content.append('<li>' + list.content[i] + '</li>');
    }
    content.append('</ul>');
    $("#content").append(content);
}

function processImageComponent(image){
    var content = '';
    if(image.src !== ""){
        content += '<img src="' + image.src + '"';
        if(image.alt !== ""){
            content += ' alt="' + image.alt + '"';
        }
        if(image.width !== ""){
            content += ' width=' + image.width;
        }
        if(image.height !== ""){
            content += ' height=' + image.height;
        }
        if(image.float !== ""){
            content += ' class="' + image.float + '"';
        }
        content += '>';
    }
    $("#content").append(content);
}

function processSlideshowComponent(slideshow){
    $("#content").append('<div id="' + slideshow.id + '"></div>');
    $.ajax({
        url: 'slideshow.html',
        dataType: 'html'
    }).done(function(data){
       $("#" + slideshow.id).append(data);
       initSlideshow(slideshow);
    });
}

function processVideoComponent(video){
    var content = '<video width="' + video.width + '"';
    content += ' height="' + video.height + '" controls>\n';
    content += '<source src="' + video.src + '" type="' + video.video_type + '">\n';
    content += 'Your browser does not support this tag.\n</video>';
    $("#content").append(content);
}
            
function loadCSS(href){
    var cssLink = $("<link rel='stylesheet' type='text/css' href='"+href+"'>");
    $("head").append(cssLink); 
}

function parseHyperLinks(content, url, begin, end){
    var parsed_content = "";
    var html_tag = '<a href="' + url + '">';
    var offset = html_tag.length;
    var html_close_tag = '</a>';
    parsed_content = insertBefore(begin, html_tag, content);
    parsed_content = insertAfter(end + offset, html_close_tag, parsed_content);
    return parsed_content;
}

function insertBefore(i, textToInsert, mainText){
    var text = mainText.slice(0, i) + textToInsert + mainText.slice(i);
    return text;
}

function insertAfter(i, textToInsert, mainText){
    var text = mainText.slice(0, i+1) + textToInsert + mainText.slice(i+1);
    return text;
}