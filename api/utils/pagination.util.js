const _ = require('underscore')
module.exports = class PaginationUtil {
    
    paginate(document, pagination){
        
        let pages = 1

        if(!pagination){
            pagination.page = 1 //4
            pagination.limit = 0 //50
        }     

        //prevents infinite or fraction pages
        if(pagination.limit != 0 && pagination.limit <= document.length ){ 
            pages = document.length / pagination.limit //10
        }
        //prevents too small
        if(pagination.page <= 0){
            pagination.page = 1
        }
        //prevents too big
        if(pagination.page > pages){
            pagination.page = pages
        }

        //remove before docs on next pages                                
        if(pagination.page > 1){
            document.splice(0, (pagination.limit * (pagination.page - 1)))
        }
        //get only pagination limit
        if(pagination.limit != 0){
            document = _.first(pagination.limit)
        }

        return {
            page: pagination.page,
            limit: pagination.limit, 
            items: document.length, 
            pages,
            documents: document,
        }
        
    }
}