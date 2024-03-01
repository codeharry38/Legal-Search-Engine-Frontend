<template>
    <span>
        <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app >
            <v-list dense>
                <template v-for="(item, j ) in items">
                    <v-list-group v-if="item.children" :key="item.text" v-model="item.model" 
                    :prepend-icon="item.Ficon" :append-icon="item.icon" color="blue-grey darken-3">
                        <template v-slot:activator>
                            <v-list-item-content>
                                <v-list-item-title class="fontSetting">{{ item.text }}</v-list-item-title>
                            </v-list-item-content>
                        </template>
                        <v-divider :key="j" v-if="item.model == true"></v-divider>
                        <router-link v-for="(child, i) in item.children" :key="i" link :to="{name:child.link}" class="SidebarLink">
                            <v-list-item>
                                <v-list-item-action v-if="child.icon">
                                    <v-icon>{{ child.icon }}</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title class="fontSetting">{{ child.text }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </router-link>
                        <v-divider></v-divider>
                    </v-list-group>
                    <router-link v-else :key="j" link :to="{name:item.link}" class="SidebarLink">
                        <v-list-item >
                            <v-list-item-action>
                                <v-icon>{{ item.Ficon }}</v-icon>
                            </v-list-item-action>
                            <v-list-item-content>
                                <v-list-item-title class="fontSetting">
                                    {{ item.text }}
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </router-link>
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue-grey darken-3" dark>
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
                <span class="hidden-sm-and-down">Law Herald</span>
            </v-toolbar-title>
            <v-spacer />
            <v-btn icon> <v-icon>mdi-apps</v-icon> </v-btn>
            <v-btn icon> <v-icon>mdi-bell</v-icon> </v-btn>
            <v-btn icon large>
                <v-avatar size="32px" item>
                    <v-img src="https://cdn.vuetifyjs.com/images/logos/logo.svg" alt="Vuetify"/>
                </v-avatar>
            </v-btn>
        </v-app-bar>
    </span>
</template>

<script>
  export default {
    props: {
      source: String,
    },
    data: () => ({
        dialog: false,
        drawer: null,
        items: [
            { Ficon: 'mdi-view-dashboard', text: 'Dashboard', link:'dashboard'},
            { Ficon: 'mdi-file-document', text: 'News', link:'news'},
            { Ficon: 'mdi-bank', text: 'Courts', link:'court'},
            { Ficon: 'mdi-account-multiple', text: 'Parties', link:'party'},
            { Ficon: 'mdi-account-badge', text: 'Salutations', link:'salutation'},
            { Ficon: 'mdi-book-open-variant', text: 'Books', link:'book'},
            {
                Ficon:'mdi-gavel',
                icon: 'mdi-chevron-down', 'icon-alt': 'mdi-chevron-up',
                text: 'Judge',
                children: [
                    {text: 'Judges', link:'judge'},
                    {text: 'Designations', link:'judgedesgn'}
                ],
            },
            {
                Ficon :'mdi-account-voice',
                icon: 'mdi-chevron-down', 'icon-alt': 'mdi-chevron-up',
                text: 'Advocate',
                children: [
                    {text: 'Advocates', link:'advocate'},
                    {text: 'Designations', link:'advocatedesgn'}
                ],
            },
            {
                Ficon:'mdi-page-layout-sidebar-right',
                icon: 'mdi-chevron-down', 'icon-alt': 'mdi-chevron-up',
                text: 'Case',
                children: [
                    {text: 'Cases', link:'case'},
                    {text: 'Case Type', link:'casetype'},
                    {text: 'Case Status', link:'casestatus'}
                ],
            },
            {
                Ficon: 'mdi-file-document',
                icon: 'mdi-chevron-down', 'icon-alt': 'mdi-chevron-up',
                text: 'Act',
                children: [
                    {text: 'Acts', link:'act'},
                    {text: 'Section Types', link:'actsection'},
                    {text: 'Subjects', link:'actsubject'},
                    {text: 'Departments', link:'actdepartment'},
                    {text: 'States', link:'actstate'},
                ],
            },
            {
                Ficon:'mdi-account-key',
                icon: 'mdi-chevron-down', 'icon-alt': 'mdi-chevron-up',
                text: 'User',
                children: [
                    {text: 'Users', link:'dashboard'},
                    {text: 'Roles', link:'dashboard'},
                    {text: 'ACLS', link:'dashboard'},
                ],
            },
            { Ficon: 'mdi-logout-variant', text: 'Logout', link:'logout'},
            /*{ Ficon: 'mdi-settings', text: 'Settings' },
            { Ficon: 'mdi-message', text: 'Send feedback' },
            { Ficon: 'mdi-help-circle', text: 'Help' },
            { Ficon: 'mdi-cellphone-link', text: 'App downloads' },
            { Ficon: 'mdi-keyboard', text: 'Go to the old version' },*/
        ],
    }),
  }
</script>
<style scoped>
.SidebarLink{
    text-decoration:none !important;
}
.v-list .router-link-exact-active{
    display: block;
    background:rgba(55, 71, 79, 0.07);
}
.fontSetting{
    font-size: 14px !important;
}
</style>