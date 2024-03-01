<template>
    <v-card outlined tile>
        <v-card-text>
            <v-row>
                <v-col cols=12>
                    <v-chip label color="primary"><v-icon small class="mr-2">mdi-pencil</v-icon> Important Note</v-chip>
                </v-col>
                <v-col>
                    <Editor api-key="csbrcr19d8ufakm7p5v5o1mjko213830ocwzb2s5thhq9msv" 
                    :init="{ menubar: true,
                        plugins: [ 'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen', 'insertdatetime media table paste code help wordcount'],
                        toolbar:'undo redo | formatselect | bold italic backcolor | \ alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help'}" v-model="importantNote"/>
                </v-col>
            </v-row>
        </v-card-text>
        <v-toolbar color="primary" flat height="50">
            <v-spacer></v-spacer>
            <v-btn color="white" :loading="isLoading" @click="Save()" >Save</v-btn>            
        </v-toolbar>
    </v-card> 
</template>
<script>
    import {bus} from '../../../main'
    import {SERVER_API} from '../../../API'
    import Editor from '@tinymce/tinymce-vue'
    export default {
        components:{Editor},
        props:['id'],
        data(){
            return {
                importantNote:'',
                isLoading:false,
            }
        },
        watch:{
            checkandfetch(){},
        },
        computed:{
            checkandfetch(){
                return this.fetchbyId();
            }
        },
        methods:{
            async fetchbyId(){
                    try{                        
                        const Response = await this.$http.get(SERVER_API+'/case/importantnote/record/'+this.id);
                        this.importantNote = Response.data.record;
                    }catch(error){
                        bus.$emit('error',error);
                    }
            },
            async Save(){
                try{
                    this.isLoading = true;
                    const Response = await this.$http.put(SERVER_API+'/case/importantnote/save',{
                        id:this.id,
                        importantNote:this.importantNote,
                    });
                    this.isLoading = false;
                    bus.$emit('response',{res: Response.data, type:'update',model:'case',component:'importantnote'});
                }catch(error){
                    this.isLoading = false;
                    bus.$emit('error',error);
                }
            },
        }
    }
</script>

<style>

</style>