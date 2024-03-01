<template>
    <v-container fluid>
        <v-row>
            <v-col lg=12 sm=12 md=12>
                <v-chip label color="blue-grey darken-3" dark>
                    <v-icon left small>mdi-view-dashboard</v-icon> Dashboard
                </v-chip>
            </v-col>
            <v-col lg=12><Media selection='multi' /></v-col>
        </v-row>
    </v-container>
</template>

<script>
import Media from '../components/media/index.vue'
export default {
    components: {Media}

}
</script>