<template>
    <v-card style="min-height:800px;position:relative">
        <v-container fluid pa-0>
            <v-app-bar  dark color="blue-grey darken-3" dense flat>
                <v-toolbar-title> Head Note </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn color="white" text fab x-small @click="close()"><v-icon>mdi-close</v-icon></v-btn>
            </v-app-bar>
            <v-card-text>
                <v-tabs v-model="headnoteTabs" color="primary" background-color="transparent" right show-arrows small>
                    <v-tabs-slider color="primary"></v-tabs-slider>
                    <v-tab>Head Note</v-tab>
                    <v-tab>Matter</v-tab>
                    <v-tab>Repeat Matter</v-tab>
                </v-tabs>
                <v-tabs-items v-model="headnoteTabs">
                    <!-- Head Note Setting -->
                    <v-tab-item>
                        <v-row>
                            <v-col cols=12 md=6 sm=12 lg=6>
                                <label>Search Acts</label>
                                <treeselect  v-model="act" :normalizer="normalizer" :default-expand-level="1"
                                :flatten-search-results="true" :multiple="false" :async="true" :load-options="loadOptions"/>

                            </v-col>
                            <v-col cols=12 md=6 sm=12 lg=6>
                                <label>Select Act First</label>
                                <treeselect  v-model="point" :options="pointHolder" :normalizer="pointlizer" :default-expand-level="2" 
                                :flatten-search-results="true" :multiple="true" label="select Points"/>
                            </v-col>
                        </v-row>
                    </v-tab-item>
                    <!-- Matter Content -->
                    <v-tab-item>
                        <v-row>                            
                            <v-col cols=12>
                                <label>Enter Matter</label>
                                <br><br>
                                 <v-textarea label="Matter" v-model="matter" outlined color="primary" rows="12"></v-textarea>
                            </v-col>
                        </v-row>
                    </v-tab-item>
                    <!-- Repeat Matter Content -->
                    <v-tab-item>
                        <v-row>                            
                            <v-col cols=12>
                                <label>Enter Repeat Matter</label>
                                <br><br>
                                 <v-textarea label="Repeat Matter" v-model="repeatMatter" outlined color="primary" rows="12"></v-textarea>
                            </v-col>
                        </v-row>
                    </v-tab-item>
                </v-tabs-items>
            </v-card-text>      
        </v-container>
        <v-bottom-navigation absolute horizontal>
            <v-spacer></v-spacer>
            <v-btn color="primary" class="white--text" dark small :loading="isLoading" @click="Save()">SAVE</v-btn>
        </v-bottom-navigation>
    </v-card>  

</template>

<script>
import {Treeselect} from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { bus } from '../../../main';
import { SERVER_API } from '../../../API';
export default {
    props:['edit','id','parent'],
    components:{Treeselect},
    data() {
        return {
            bottomNav: 'recent',
            headnoteTabs:0,
            act:null,
            point:[],
            matter:'',
            repeatMatter:'',
            pointHolder:[],
            normalizer(node) {
                return { id: node._id, label: node._source.name}
            },
            pointlizer(node) {
                return { id: node._id, label: node.recordType+'.'+node.number+' '+node.name}
            },
            isLoading:false
        }
    },
    watch:{
        async act(val){
            if(val != ''){
                const Response = await this.$http.get(SERVER_API+'/acttree/tree/'+val);
                this.pointHolder = Response.data.records;
            }
        },
        checkandfetch(){ }
    },
    computed:{
        checkandfetch(){
            return this.fetchByid();
        }
    },
    methods:{
        // Search For Act
        async loadOptions({searchQuery, callback }) {
            const Response = await this.$http.post(SERVER_API+'/act/local/search',{query:searchQuery});
            callback(null, Response.data.records)
        },
        close(){
            this.reset();
            bus.$emit('close',{component:'local'});
        },
        reset(){
            this.id = '';
            this.act = '';
            this.point = [];
            this.matter = '';
            this.repeatMatter = '';
        },
        Save(){
            this.edit == true ? this.update() : this.create();
        },
        async fetchByid(){
            if(this.edit == true){
                const Response = await this.$http.get(SERVER_API+'/case/headnote/findbyid/'+this.id);
                this.act = Response.data.record.act;
                this.point = Response.data.record.point;
                this.matter = Response.data.record.matter;
                this.repeatMatter = Response.data.record.repeatMatter;
            }

        },
        async create(){
            try{
                this.isLoading = true;
                const Response = await this.$http.post(SERVER_API+'/case/headnote/create',{
                    parent:this.parent,
                    act:this.act,
                    point:this.point,
                    matter:this.matter,
                    repeatMatter:this.repeatMatter
                });
                this.isLoading = false;
                this.reset();
                bus.$emit('response',{res: Response.data, type:'create',model:'headnote'});
                this.close();
            }catch(error){
                this.isLoading = false;
                bus.$emit('error',error);
            }
        },
        async update(){
            try{
                this.isLoading = true;
                const Response = await this.$http.put(SERVER_API+'/case/headnote/update',{
                    id:this.id,                   
                    act:this.act,                    
                    point:this.point,
                    matter:this.matter,
                    repeatMatter:this.repeatMatter
                });
                this.isLoading = false;
                bus.$emit('response',{res: Response.data, type:'update',model:'headnote'});
                this.close();
            }catch(error){
                this.isLoading = false;
                bus.$emit('error',error);
            }
        }
    }

}
</script>

<style>

</style>