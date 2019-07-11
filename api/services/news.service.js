// dependencies
const News = require('../models/news.schema')

module.exports = class NewsService {

    async findAll(){
        return await News.find().populate(
            'tournament').exec()
    }

    async findAlike(options){
        return await News.find(Options).populate(
            'tournament').exec()
    }

    async findOneById(id){
        return await News.findById(id).populate(
            'tournament').exec()
    }

    async findByTournamentId(id){
        return await News.find().where('tournament').equals(id).populate(
            'tournament').exec()
    }

    async createOneOrMany(news){

        if(news.length == 1){
            news = new News(news)
        } else if (news.length > 1){
            news.forEach(insert => {
                return insert = new News(insert)
            })
        }
        
        return await News.create(news)

    }
    
    async update(id, newNews) {

        const news = await News.findById(id).exec()

        if(!news._id){
            return {
                success: false,
                message: 'No News Where Found'
            }
        }

        return await News.findByIdAndUpdate(id, newNews, {new: true, runValidators: true}).populate(
            'tournament').exec()

    }

    constructor(){}

};