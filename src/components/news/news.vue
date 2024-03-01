<template>
    <v-form>
        <v-card-text class="mt-5">
            <v-row>
                <v-col sm=12 md=12 cols=12 class="py-0">
                    <v-text-field v-model="title" outlined label="Title" dense></v-text-field>
                </v-col>    
                <v-col sm=12 md=12 cols=12 class="py-0">
                    <v-textarea v-model="description" outlined label="Short description" dense></v-textarea>
                </v-col>    
                <v-col sm=12 md=12 cols=12 class="py-0">
                    <Editor api-key="csbrcr19d8ufakm7p5v5o1mjko213830ocwzb2s5thhq9msv" 
                    :init="{ menubar: true,
                        plugins: [ 'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen', 'insertdatetime media table paste code help wordcount'],
                        toolbar:'undo redo | formatselect | bold italic backcolor | \ alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help'}" v-model="content"/>
                </v-col>  
                 <v-col v-if="cover == null"  sm=12 md=12 cols=12 class="py-5 my-5">
                    <v-btn @click="triggeredEvent=''; MediaBox = true" color="primary" block class="elevation-0" dark>Select Feature Image</v-btn>
                </v-col>  
                <v-col v-else sm=12 md=12 cols=12 class="py-5 my-5 mediaHolder">
                    <p class="selectedMediaP">Selected Media</p>
                    <v-img  :src="currentImage" class="selectedMedia" style="border:1px solid #ddd;" :lazy-src="currentImage" aspect-ratio="1" width="200">
                        <v-icon class="closeIcon" color="white" @click="removeImage">mdi-close</v-icon>
                        <v-icon class="replaceIcon" color="white" @click=" triggeredEvent='replace'; MediaBox = true">mdi-arrow-left-right</v-icon>
                    </v-img>
                </v-col>  

            </v-row>
        </v-card-text>
        <v-toolbar color="primary" flat height="50">
            <v-spacer></v-spacer>
            <v-switch :label="status == true ? 'Active': 'Inactive'" v-model="status" dark class="mt-5 mx-5" color="white"></v-switch>
            <v-btn color="white" :loading="isLoading" @click="Save()" >Save</v-btn>            
        </v-toolbar>

        <v-dialog v-model="MediaBox" width="100%" style="height:100vh;" transition="dialog-transition">
            <Media :selection='"single"' :triggeredEvent="triggeredEvent" :loaded="cover" :react="MediaBox"></Media>
        </v-dialog>

        <!-- Notifications -->
        <v-snackbar v-model="notificationBar" :timeout="10000" top right :color="notificationColor" multi-line class="notificationCustomBar"> {{ notificationText }} 
            <template v-slot:action="{ attrs }">
                <v-btn color="white" text v-bind="attrs" @click="notificationBar = false" >Close</v-btn>
            </template>
        </v-snackbar>

    </v-form>
</template>

<script>
// End Component
import {SERVER_API} from '../../API'
import {bus} from '../../main'
import Config from '../../config'
import Media from '../media/index.vue'
import Editor from '@tinymce/tinymce-vue'
export default {
    props:['edit','id'],
    components: {
        Media: Media,
        Editor: Editor
    },
    data(){
        return{
            triggeredEvent:'',
            menu:false,
            title: '',
            description: '',
            content: '',
            cover: null,
            status:false,
            currentImage:'',
            //Loading 
            isLoading:false,
            // Dialog Box
            MediaBox:false,
            //Notifications
            notificationBar:false,
            notificationColor:'#333',
            notificationText:'',

        }
    },
    created(){
        bus.$on('close',() =>  {
            this.MediaBox = false;
        });

         bus.$on('media',data =>  {
            this.cover = data;
            this.MediaBox = false;
        });

        bus.$on('error', error =>  {
            this.notificationBar = true;
            this.notificationColor = 'red';
            this.notificationText = Config.httpError(error);
        });
        bus.$on('response', data =>  {
            if(data.model == 'department'){
                this.newDepartment(data);
            }else if(data.model == 'subject'){
                this.newSubject(data);
            }else if(data.model =='state'){
                this.newState(data);
            }else{
                this.notificationBar = true;
                this.notificationColor = data.res.action == true ? '#333' : 'red';
                this.notificationText = data.res.message;
            }
        });
        
    },
    watch: {
        checkandFetch() {
            // Just Checking Computed For fething data;;;;
        },
        cover(){
            this.showMedia();
        }
    },
    computed:{
        checkandFetch(){
            return this.fetchbyId();
        },
        
    },
    methods:{
        removeImage(){
            this.cover = null;
        },
        async showMedia(){
            if(this.cover !=null){
                const Response = await this.$http.get(SERVER_API+'/media/findbyid/'+this.cover);
                this.currentImage = Config.mediaInit(Response.data.record);
            }
        },
        async fetchbyId(){
            if(this.edit == true){
                //alert(this.id);
                try{
                    
                    const Response = await this.$http.get(SERVER_API+'/news/findbyid/'+this.id);
                    this.title = Response.data.record.title;
                    this.description = Response.data.record.description;
                    this.content = Response.data.record.content;
                    this.cover = Response.data.record.cover;
                    this.status = Response.data.record.status;
                }catch(error){
                    bus.$emit('error',error);
                }
            }
        },
        Save(){
            this.edit == true ? this.update() : this.create();
        },
        async create(){
            try{
                this.isLoading = true;
                const Response = await this.$http.post(SERVER_API+'/news/create',{
                    title: this.title,
                    description: this.description,
                    content: this.content,
                    cover: this.cover,
                    status: this.status,
                });
                this.isLoading = false;
                bus.$emit('response',{res: Response.data, type:'create', model:'news'});
            }catch(error){
                this.isLoading = false;
                bus.$emit('error',error);
            }
        },
        async update(){
            try{
                this.isLoading = true;
                const Response = await this.$http.put(SERVER_API+'/news/update',{
                    id:this.id,
                    title: this.title,
                    description: this.description,
                    content: this.content,
                    cover: this.cover,
                    status: this.status,
                });
                this.isLoading = false;
                bus.$emit('response',{res: Response.data, type:'update', model:'news'});
            }catch(error){
                this.isLoading = false;
                bus.$emit('error',error);
            }
        }
    }

}
</script>

<style>
.selectedMediaP{
    font-size:15px;
    padding-bottom:0px;
    font-weight: bold;
}
.selectedMedia:hover .replaceIcon {
    opacity:1;
    transition:all ease 0.5s;
}
.selectedMedia:hover .closeIcon {
    opacity:1;
    transition:all ease 0.5s;
}
.replaceIcon{
    opacity: 0;
    padding: 9px;
    font-size: 15px !important;
    background: rgba(00,00,00,0.7);
    position: absolute !important;
    left: auto;
    right: 5px;
    top: 41px;
    transition:all ease 0.5s;
}
.replaceIcon:hover{
    background:rgba(255,255,255,0.9);
    color:#000 !important;
}
.closeIcon{
    opacity: 0;
    padding: 9px;
    font-size: 15px !important;
    background: rgba(00,00,00,0.7);
    position: absolute !important;
    left: auto;
    right: 5px;
    top: 5px;
    transition:all ease 0.5s;
}
.closeIcon:hover{
    background:rgba(199, 1, 1, 0.9);
}
.mediaHolder{
    background:rgba(00,00,00,0.1);
    border:1px solid #ddd;
}
</style>