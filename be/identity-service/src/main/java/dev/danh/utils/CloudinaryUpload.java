package dev.danh.utils;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import io.github.cdimascio.dotenv.Dotenv;

import java.util.Map;

public class CloudinaryUpload {
    public static void main (String[] args) {
        Dotenv dotenv = Dotenv.load();
        // Set your Cloudinary credentials
        Cloudinary cloudinary = new Cloudinary(dotenv.get("CLOUDINARY_URL"));
        System.out.println(cloudinary.config.cloudName);
    }
    public static String uploadImage(String imagePath) {
        try {
            Dotenv dotenv = Dotenv.load();
            Cloudinary cloudinary = new Cloudinary(dotenv.get("CLOUDINARY_URL"));
            Map<String, Object> uploadResult = cloudinary.uploader().upload(imagePath, ObjectUtils.emptyMap());
            return (String) uploadResult.get("url");
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
