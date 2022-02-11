import {Request, Response} from 'express'
import Photo from '../models/Photo';
import path from 'path';
import fs from 'fs-extra';

export async function getPhotos(req: Request, res: Response): Promise<Response>{

    const photos = await Photo.find();

    if(photos.length > 1){
        return res.json({
            success: true,
            status: 200,
            photos
        });
    }else{
        return res.json({
            success: false,
            status: 204,
            message: "Photos Not Found"
        });
    }


}

export async function getPhoto(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const photo =  await Photo.findById(id);
    
    if(!photo){
        return res.json({
            success: false,
            status: 404,
            message: "Photo Not Found"
        });
    }

    return res.json({
        success: true,
        status: 200,
        photo
    });
    
}

export async function createPhoto(req: Request, res: Response): Promise<Response>{

    const {title, description} = req.body;

    const newPhoto = {
        title: title,
        description: description,
        imagePath: req.file?.path
    };
    
    const photo = new Photo(newPhoto);
    await photo.save();

    return res.json({
        success: true,
        status: 200,
        message: "Photo successfully saved",
        photo
    })
}

export async function updatePhoto(req: Request, res: Response): Promise<Response>{
    const {id} = req.params;
    const {title, description } = req.body;

    const updatedPhoto = await Photo.findByIdAndUpdate(id, {
        title,
        description
    }, {new: true})

    return res.json({
        success: true,
        status: 200,
        message: "Successfully updated",
        updatedPhoto
    })

}

export async function deletePhoto(req: Request, res: Response): Promise<Response>{
    const {id} = req.params;
    const photo = await Photo.findByIdAndRemove(id);

    if(photo){
        await fs.unlink(path.resolve(photo.imagePath))
    }else{
        return res.json({
            success: false,
            status: 404,
            message: "Photo Not Found"
        });
    }

    return res.json({
        success: true,
        status: 200,
        message: "Photo deleted",
        photo
    });
}
