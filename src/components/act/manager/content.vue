<template>
    <v-form>
        <v-card>
            <v-toolbar color="primary" dark height="45" dense>
                <v-card-title primary-title>
                    {{edit == true ? 'Edit Record' : 'New Record'}}
                </v-card-title>
                <v-spacer></v-spacer>
                <v-btn color="white" @click="close()" text fab x-small> <v-icon>mdi-close</v-icon></v-btn>
            </v-toolbar>
            <v-card-text>
                <v-row>
                    <v-col cols=9>
                        <v-autocomplete label="Select Record Type" :items="SectionRecords" item-text="name" item-value="_id"
                        v-model="recordType" color="primary" outlined dense hide-details></v-autocomplete>
                    </v-col>
                    <v-col cols=3>
                        <v-btn color="primary" small class="elevation-0" @click="sectionBox = true"><v-icon>mdi-plus</v-icon></v-btn>
                    </v-col>
                </v-row>
                <v-row v-if="recordType == ''">
                    <v-col cols=12>
                        <h1 class="text--primary text--lighten-2">Frist Select Record Type</h1>
                    </v-col>
                </v-row>
                <v-row v-else>
                    <v-col cols=12>
                        <label class="font-weight-bold">Select Parent</label>
                        <treeselect  v-model="parent" :options="TreeRecord" :normalizer="normalizer" :default-expand-level="3" 
                        :flatten-search-results="true" :multiple="false" label="select Parent"/>
                    </v-col>
                    <v-col cols=12 col=6 md=6 sm=6>
                        <v-text-field v-model="name" label="Title/Name" outlined color="primary" dense hide-details></v-text-field>
                    </v-col>
                    <v-col cols=12 col=6 md=6 sm=6>
                        <v-text-field v-model="number" label="Number" outlined color="primary" dense hide-details></v-text-field>
                    </v-col>
                    <v-col cols=12>
                        <Editor api-key="csbrcr19d8ufakm7p5v5o1mjko213830ocwzb2s5thhq9msv" 
                            :init="{ menubar: true,
                            plugins: [ 'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen', 'insertdatetime media table paste code help wordcount'],
                            toolbar:'undo redo | formatselect | bold italic backcolor | \ alignleft aligncenter alignright alignjustify | \
                            bullist numlist outdent indent | removeformat | help'}" v-model="description"/>

                    </v-col>
                    <v-col cols=12>
                        <v-toolbar color="transparent" dense flat>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" class="elevation-0" :loding="isLoading" @click="save()">Save</v-btn>
                        </v-toolbar>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        <!-- Diloge -->
        <!-- Create -->
        <v-dialog v-model="sectionBox" scrollable persistent max-width="500px" transition="dialog-transition">
            <Section :edit="false"></Section>
        </v-dialog>
        <!-- Notifications -->
        <v-snackbar v-model="notificationBar" :timeout="10000" top center :color="notificationColor" multi-line class="mt-70"> {{ notificationText }} <v-btn color="white" text fab @click="notificationBar = false"><v-icon>mdi-close</v-icon> </v-btn></v-snackbar>
    </v-form>
</template>

<script>
import {Treeselect} from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { SERVER_API } from '../../../API';
import Config from '../../../config';
import { bus } from '../../../main';
import Editor from '@tinymce/tinymce-vue'

const Section = () => import('../section.vue');
    export default {
        props:['id','edit','actid'],
        components:{Section, Editor,Treeselect},
        data() {
            return{
                recordType:'',
                name:'',
                parent:null,
                number:'',
                description:'',
                //loading
                isLoading:false,

                // Holder
                SectionRecords:[],
                TreeRecord:[],

                // Diloge
                sectionBox:false,
                

                //Notifications
                notificationBar:false,
                notificationColor:'black',
                notificationText:'',
                // Intilization of Tree Content
                normalizer(node) {
                    return { id: node._id, label: node.recordType+'.'+node.number+' '+node.name}
                }
            }
        },
        created(){
            bus.$on('close',() =>  {
                this.sectionBox = false;
            });

            bus.$on('error', error =>  {
                //alert('s');
                this.notificationBar = true;
                this.notificationColor = 'red';
                this.notificationText = Config.httpError(error);
            });

            bus.$on('response', data =>  {
                this.notificationBar = true;
                this.notificationColor = data.res.action == true ? 'black' : 'red';
                this.notificationText = data.res.message;
                if(data.model == 'actSection'){
                    data.res.record == '' ? '' : this.SectionRecords.unshift(data.res.record);
                    this.recordType = data.res.record._id;
                }
            });           
        },
        watch:{
            checkandfetchsection(){ },
            checkandfetchbyid(){ },
            checkandfetchtree() { }
        },
        computed:{
            checkandfetchsection(){
                return this.fetchsection();
            },
            checkandfetchbyid(){
                return this.fetchbyid();
            },
            checkandfetchtree(){
                return this.fetchTree();
            }
        },
        methods:{
            async fetchTree(){
                const Response = await this.$http.get(SERVER_API+'/acttree/tree/'+this.actid);
                this.TreeRecord = Response.data.records;
            },
            async fetchbyid(){
                if(this.edit == true){
                    const Response = await this.$http.get(SERVER_API+'/acttree/findbyid/'+this.id);
                    this.recordType = Response.data.record.recordType;
                    this.name = Response.data.record.name;
                    this.parent = Response.data.record.parent;
                    this.number = Response.data.record.number;
                    this.description = Response.data.record.description;
                }
            },
            close(){
               this.edit == true ? '' : this.reset(); 
               bus.$emit('close','contentclose');
            },
            reset(){
                this.id = '';
                this.actid = '';
                this.name = '';
                this.parent = null;
                this.number = '';
                this.description = '';
                this.recordType = '';
            },
            async fetchsection(){
                const Response = await this.$http.get(SERVER_API+'/act/section/records');
                this.SectionRecords = Response.data.records;
            },
            save(){
                this.edit == true ? this.update() : this.create();
            },
            async update(){
                try{
                    this.isLoading = true
                    const Response = await this.$http.put(SERVER_API+'/acttree/update',{
                        id:this.id,
                        actid:this.actid,
                        name : this.name,
                        parent:this.parent,
                        number: this.number,
                        description : this.description,
                        recordType: this.recordType,
                    });
                    this.isLoading = false;
                    bus.$emit('response',{res: Response.data, type:'update',model:'actcontent'});
                    this.close();
                }catch(error){
                    this.isLoading = false;
                    bus.$emit('error',error);
                }
            },
            async create(){
                try{
                    this.isLoading = true
                    const Response = await this.$http.post(SERVER_API+'/acttree/create',{
                        actid:this.actid,
                        name : this.name,
                        parent:this.parent,
                        number: this.number,
                        description : this.description,
                        recordType: this.recordType,
                    });
                    this.isLoading = false;
                    this.reset();
                    bus.$emit('response',{res: Response.data, type:'create',model:'actcontent'});
                    this.close();
                }catch(error){
                    this.isLoading = false;
                    bus.$emit('error',error);
                }

            }
        }

    }
</script>