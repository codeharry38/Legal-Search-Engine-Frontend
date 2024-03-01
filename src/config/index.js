import {WEB_LINK} from '../API'
class Config {
    httpError(message){
        if(message.response){
            if(message.response.data.errors){
                const data = message.response.data.errors.map(data =>{
                    return ' '+data.msg;
                });
                return data.toString();                    
            }else if(message.response.status == 404){
                return 'Record Not Found. 404 error code';
            }else{
                return message.response.data.message;
            }
        }else{
            return message;
        }
    }
    fileUrl(data){
        return WEB_LINK+''+data.filePath;
    }
    mediaInit(data){
        var extenstion = data.extention;
        if(extenstion == 'jpg' || extenstion == 'png'){
            return WEB_LINK+''+data.filePath;
        } else if (extenstion == 'doc' || extenstion == 'docm' || extenstion == 'docx' || extenstion == 'docx'){
            return '/assets/icons/docs.jpg';
        } else if (extenstion == 'pdf'){
            return '/assets/icons/pdf.jpg';
        } else if (extenstion == 'xlsx' || extenstion == 'xlsb' || extenstion == 'xls' || extenstion == 'xlsm'){
            return '/assets/icons/excel.jpg';
        } else if (extenstion == 'ppsm' || extenstion == 'ppt' || extenstion == 'pptm' || extenstion == 'pptx'){
            return '/assets/icons/ppt.jpg';
        } else if (extenstion == 'mp4' || extenstion == 'm4a' || extenstion == 'm4p' || extenstion == 'm4b' || extenstion == 'm4r' || extenstion == 'm4v'){
            return '/assets/icons/video.jpg';
        } else if (extenstion == 'txt'){
            return '/assets/icons/text.jpg';
        } else{
            return '/assets/icons/unknown.jpg';
        }
    }
    formatFileSize(bytes,decimalPoint) {
        if(bytes == 0) return '0 Bytes';
        var k = 1000,
            dm = decimalPoint || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
     }

    formatedDate(date= ""){
        if(date=="" || date==null){
            return 'Not Given';
        }else{
            let givenDate = new Date(date);
            return givenDate.getDate()+'/'+(givenDate.getMonth()+1)+'/'+givenDate.getFullYear();
        }
    }

    formFormatedDate(date= ""){
        if(date=="" || date==null){
            return 'Not Given';
        }else{
            let givenDate = new Date(date);
            return givenDate.getFullYear()+'-'+(givenDate.getMonth()+1)+'-'+ givenDate.getDate();
        }
    }
}
export default new Config();