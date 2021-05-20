const objTypeProperties = [
    "main_product",
    "provider",
    "game_studio",
    "seo_breadcrumb",
    "games",
    "zones",
    "game_mechanics",
    "game_tags",
    "related_games",
    "3d_touch_navigation",
    "categories",
    "app_list",
    "prospect_homepage",
    "top_navigation_desktop_prospect"    ,
    "top_navigation_mobile_prospect",
    "bottom_bar_mobile_prospect",
    "prospect_recommended_games_for_search",
    "logged_out_homepage",
    "logged_out_homepage_ios",
    "top_navigation_desktop_logged_out",
    "top_navigation_mobile_logged_out",
    "bottom_bar_mobile_logged_out",
    "logged_out_recommended_games_for_search",
    "logged_in_homepage",
    "top_navigation_desktop_logged_in",
    "bottom_bar_mobile_logged_in",
    "logged_in_recommended_games_for_search",
    "vip_homepage",
    "top_navigation_desktop_vip",
    "bottom_bar_mobile_vip",
    "vip_recommended_games_for_search",


];

const arrTypeProperties = [
    { property : "game_mechanics", item: "game_mechanic" },
    { property : "game_tags", item: "tag" },
    { property : "related_games", item: "game" },
    { property: "games", item: "game" },
    { property: "zones", item: "zone" },
    { property: "categories", item: "category" },
    { property: "prospect_recommended_games_for_search", item: "game" },
    { property: "logged_out_recommended_games_for_search", item: "game" },
    { property: "logged_in_recommended_games_for_search", item: "game" },
    { property: "vip_recommended_games_for_search", item: "game" },

];

const isEmpty = (obj) => {
    return Object.keys(obj).length === 0;
}

const updateFileContent = (content = "", ids = []) => {    
    
  if (content != "" && ids.length > 0) {
    //console.log(content);

    const keys = Object.keys(content);    
    //console.log(keys);

    let objProps = keys.filter(el => objTypeProperties.includes(el))    
    
    //console.log(objProps);

    objProps.forEach(el => {
        
        let resultObj = null;

        if (Array.isArray(content[el])) {            
            
            let arrItems = [];
            
            const objArrProps = arrTypeProperties.find(p => p.property == el)            

            content[el].forEach(item => {
                const arrItem = updateObj(item[objArrProps.item], el, ids, objArrProps.item, true);
                if (arrItem != null) {
                    arrItems.push(arrItem);   
                }
            })

            //console.log("arrItems:", arrItems);
            
            if (arrItems.length > 0) {
                resultObj = arrItems;   
            }

        } else {
            resultObj = updateObj(content[el], el, ids);
        }

        if (null != resultObj) {
            content[el] = resultObj;
           /*
            console.log("=======================");
            console.log("resultObj:", resultObj)
            
            console.log("content[el]:", content[el])
            console.log("======================")
            */
        }
    });

    //Custom type Zone
    if (content.type == "zone" && keys.includes("body")) {
        const res = updateCustomObjZone(content["body"], "body", ids);
        content["body"] = res;
    }

    //Custom type Navigation
    if (content.type == "navigation" && keys.includes("items")) {
        const res = updateCustomObjNavigation(content["items"], "items", ids);        
        content["items"] = res;
    }

        
    //console.log(content)
    return content;
  }
}

const updateObj = (obj, property, ids, arrItem = "", isArray = false) => {

    if (typeof obj == 'undefined' || obj == null) {
        //console.log("Obj is undefined or property " + property + " is null")
        return null
    };

    const wioUrl = "wio://documents/";
    
    let idsObj = ids.find(el => el.source_id == obj.id)
    //console.log(ids);   
    /*
    console.log(typeof idsObj != 'undefined')
    console.log(idsObj.hasOwnProperty("target_id"))
    console.log(obj.hasOwnProperty("id"))
    console.log(obj.hasOwnProperty("wioUrl"))    
    */

    if (
        typeof idsObj != 'undefined' && 
        idsObj.hasOwnProperty("target_id") &&
        obj.hasOwnProperty("id") &&
        obj.hasOwnProperty("wioUrl")
    ) {
    
        if (arrItem != "" && isArray) {
            return {
                [arrItem] : {
                    id: idsObj.target_id,
                    wioUrl: wioUrl + idsObj.target_id    
                }
            }
        } else {
           
            return {
                id: idsObj.target_id,
                wioUrl: wioUrl + idsObj.target_id
                }     
            }
    }
    
    return null;
}

const updateCustomObjZone = (obj, property, ids, arrItem = "") => {

    const wioUrl = "wio://documents/";

    //console.log(obj);

    if (Array.isArray(obj)) {

        let arrZoneBody = [];

        obj.forEach(el => {

            let arrTargetRepeat = [];
            const sourceValueObj = el.value; 
            let targetValueObj = {};       
            const arrSourceRepeat = sourceValueObj.repeat;

            arrSourceRepeat.forEach(rep => {
                //check if item is empty
                if (!isEmpty(rep)) {
                    const updatedRepeatObj = updateObj(rep.item, "repeat", ids, "item", true);
                    if (updatedRepeatObj != null) {
                        arrTargetRepeat.push(updatedRepeatObj);   
                    }
                }
            })
            
            if (arrTargetRepeat.length > 0) {

                targetValueObj = { ...{repeat: arrTargetRepeat} };
                el.value = targetValueObj;
            }
        })
    }       

    return obj;  
}

const updateCustomObjNavigation = (obj, property, ids, arrItem = "") => {

    //console.log(obj);

    if (Array.isArray(obj)) {

        let arrTargetItems = [];

        obj.forEach(item => {
            let itemObj = {};
            
            item.hasOwnProperty("name") ? itemObj.name = item.name : '';
            item.hasOwnProperty("icon") ? itemObj.icon = item.icon : '';

            if (item.hasOwnProperty("link")) {
                const updatedLinkObj = updateObj(item.link, "link", ids);
                if (updatedLinkObj != null) {
                    itemObj.link = updatedLinkObj;                    
                    arrTargetItems.push(itemObj);   
                }
            }
          
        })

        if (arrTargetItems.length > 0) {
            obj = arrTargetItems;
        }
    }       

    return obj;  
}


module.exports = {
    updateFileContent,
};