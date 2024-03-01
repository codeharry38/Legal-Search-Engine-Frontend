<template>
    <v-card flat>
        <v-tabs v-model="MediaTabs">
            <v-tabs-slider color="primary"></v-tabs-slider>
            <v-tab>Upload</v-tab>
            <v-tab>Meida</v-tab>
        </v-tabs>
        <v-tabs-items v-model="MediaTabs" class="px-5 py-5">
            <v-tab-item>
                <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions"></vue-dropzone>
            </v-tab-item>
            <!--------------------------------------- Meida Setting -------------------------------->
            <v-tab-item>
                <v-container fluid class="px-0">
                    <v-row>
                        <v-col cols=12 md=3 sm=12>
                            <v-text-field
                                v-model="search"
                                type="text"
                                dense
                                label="Search By Name"
                                hide-details
                                outlined
                                color="primary"
                            >
                            <template v-slot:append-outer>
                                <v-btn class="elevation-0" fab dark x-small color="primary"><v-icon dark>mdi-image-search-outline</v-icon></v-btn>
                            </template>                            
                            </v-text-field>
                        </v-col>
                        <v-col cols=12 md=3 sm=5>
                            <v-menu ref="fromMenu" v-model="fromMenu" :close-on-content-click="false" 
                            :return-value.sync="fromDate" transition="scale-transition" offset-y min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="fromDate" outlined dense hide-details label="From Date" prepend-icon="mdi-calendar"
                                    readonly v-bind="attrs" v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="fromDate" no-title scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="fromMenu = false">Cancel</v-btn>
                                    <v-btn text color="primary" @click="$refs.fromMenu.save(fromDate)">OK</v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols=10 md=3 sm=5>
                            <v-menu ref="toMenu" v-model="toMenu" :close-on-content-click="false" 
                            :return-value.sync="toDate" transition="scale-transition" offset-y min-width="auto">
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field v-model="toDate" outlined dense hide-details label="To date" prepend-icon="mdi-calendar"
                                    readonly v-bind="attrs" v-on="on"></v-text-field>
                                </template>
                                <v-date-picker v-model="toDate" no-title scrollable>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="toMenu = false">Cancel</v-btn>
                                    <v-btn text color="primary" @click="$refs.toMenu.save(toDate)">OK</v-btn>
                                </v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols=2 md=3 sm=2>
                            <v-btn class="elevation-0" dark medium color="primary">Fetch</v-btn>
                        </v-col>
                    </v-row>
                    <v-row>
                        <!-- Media Showing -->
                        <v-col cols=12 md=8 lg=8 sm=8 class="px-0">
                            <v-card class="mediaContainer pa-3" flat>
                                <v-row>
                                    <v-col cols="12" md="3" v-for="(media, i) in mediaRecords" :key="i" :title="media.name">
                                        <v-img :class="mediaSelected(media._id) ? 'selectMedia mediaGallery' : 'mediaGallery'" @click="selectMedia(media._id)" :src="config.mediaInit(media)" 
                                        :lazy-src="config.mediaInit(media)" aspect-ratio="1">
                                        </v-img>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                        <v-col cols=12 md=4 lg=4 sm=4 class="px-0">
                            <v-card color="#efefef" flat height="500" class="pa-4" v-if="position">
                                <h3>Media Info</h3>
                                <v-divider class="mt-3 mb-5" color="#dedede"></v-divider>
                                <tabel class="Customtable">
                                    <tr>
                                        <td class="mediaInfo" style="width:120px">Upload_at:</td>
                                        <td class="mediaInfo"> 29/09/2021</td>
                                    </tr>
                                    <tr>
                                        <td class="mediaInfo" style="width:120px">Name:</td>
                                        <td class="mediaInfo" >{{position.fileName}}</td>
                                    </tr>
                                    <tr>
                                        <td class="mediaInfo" style="width:120px">Type:</td>
                                        <td class="mediaInfo">{{position.type}}</td>
                                    </tr>
                                    <tr>
                                        <td class="mediaInfo" style="width:120px">Size:</td>
                                        <td class="mediaInfo">{{config.formatFileSize(position.size,1)}}</td>
                                    </tr>
                                    <tr>
                                        <td class="mediaInfo" style="width:120px">File url:</td>
                                        <td class="mediaInfo"><a :href="config.fileUrl(position)" target="_blank">Click Here</a></td>
                                    </tr>
                                </tabel>
                                <v-btn small color="red" class="elevation-0 mt-5" block dark @click="deleteMedia()"> <v-icon x-small dark class="mr-2">mdi-delete</v-icon> Delete</v-btn>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-toolbar color="primary" flat height="50">
                        <v-spacer></v-spacer>
                        <v-btn color="white" @click="pushMedia" :disabled="isDisable" class="mr-5">Select</v-btn>
                        <v-btn color="red" @click="cancel" dark>Cancel</v-btn>          
                    </v-toolbar>
                </v-container>
            </v-tab-item>
        </v-tabs-items>
    </v-card>
</template>

<script>
import {SERVER_API} from '../../API'
import config from '../../config'
import vue2Dropzone from 'vue2-dropzone'
import {bus} from '../../main'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
export default {
    components: {
        vueDropzone: vue2Dropzone
    },
    
    props:['selection','selected','loaded','triggeredEvent','react'],
    mounted(){
        this.fetchMedia();
        this.replaceMeida();
    },
    data(){
        return{
            MediaTabs:0,
            search:'',
            config: config,
            dropzoneOptions: {
                url: SERVER_API+'/media/upload',
                thumbnailWidth: 150,
                maxFilesize: 10,
                headers: { "My-Awesome-Header": "header value" }
            },
            currentMedia: this.loaded,
            mediaRecords:[],
            SelectedMedia:this.selection == 'multi' ? [] : '',
            fromDate:'',
            toDate:'',
            fromMenu:false,
            toMenu:false,
            position:'',
            isDisable: false,
        }
    },
    watch:{
       react(){
            this.checkselection();
       }
    },
    computed:{
        checkselection(){
            return this.replaceMeida();
        },
        
    },
    methods:{
        replaceMeida(){
            if(this.triggeredEvent == 'replace'){
                this.selectMedia(this.loaded);
            }else{
                //remain silence
            }
        },
        async deleteMedia(){
            try{
            const response = await this.$http.get(SERVER_API+'/media/delete/'+this.position._id);
                this.deleteArray(this.position);
                alert(response.data.message);
            }catch(error){
                alert('there is an error' + error);
            }

        },
        async fetchMedia(){
            try{
            const response = await this.$http.get(SERVER_API+'/media');
                this.mediaRecords = response.data.records;

            }catch(error){
                alert('there is an error' + error);
            }
        },
        deleteArray(data){
            const remove = this.mediaRecords.indexOf(data);
            this.mediaRecords.splice(remove, 1);
        },
        // ============ Select Media ============
        selectMedia(id){
            if(this.selection == 'multi'){
                this.position = this.mediaRecords.find(x => {
                        return x._id == id;
                    })
                    //console.log(this.position);
                if(this.SelectedMedia.includes(id)){
                    var data = this.SelectedMedia.indexOf(id);
                    this.SelectedMedia.splice(data, 1);
                }else{
                    this.SelectedMedia.push(id);
                }
            }else{
                if(this.SelectedMedia == id){
                    this.SelectedMedia = '';
                }else{
                    this.SelectedMedia = id;
                }
            }
            //console.log(this.SelectedMedia);
        },
        mediaSelected(id){
            if(this.selection == 'multi'){
                return this.SelectedMedia.includes(id);
            }else{
                return this.SelectedMedia == id ? true : false;
            }
        },
        // ============Cancel Media ==========
        pushMedia(){ 
            bus.$emit('media',this.SelectedMedia);
            this.cancel();
        },
        cancel(){
            if(this.selection == 'multi'){
                this.SelectedMedia = [];
            }else{
                this.SelectedMedia = '';
            }
            bus.$emit('close',false);
        }
    }

}
</script>

<style>
.Customtable{
    width: 100%;
    display: block;
    word-break: break-all;
}
.mediaInfo{
    color:#555;
    font-size:13px;
    font-weight: 400;
    line-height: 20px;
    margin-bottom:20px;
    word-wrap: break-word;
}
.selectMedia{
    box-shadow:0px 0px 0px 5px #37474f;
    position: relative;
}
.selectMedia::after{
    position:absolute;
    content:"\2713";
    font-size:15px;
    color:#fff;
    background:#37474f;
    width:30px;
    height:30px;
    right:0;
    top:0;
    text-align: center;
    line-height: 200%;
}
.mediaContainer{
    min-height:500px !important;
    max-height: 70vh;
    overflow-y:scroll;
    overflow-x:inherit;
}
.mediaGallery{
    cursor:pointer;
    border:1px solid rgba(00,00,00,0.1);
}

</style>