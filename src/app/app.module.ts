import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {AsanaModule} from './services/asana/asana.module';
import {TmetricModule} from './services/tmetric/tmetric.module';
import {Apollo, ApolloModule} from 'apollo-angular';
import {HttpLink, HttpLinkModule} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import {HttpClientModule, HttpHeaders} from '@angular/common/http';
import {setContext} from 'apollo-link-context';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AsanaModule,
    TmetricModule,
    ApolloModule,
    HttpClientModule,
    HttpLinkModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(apollo: Apollo, httpLink: HttpLink) {
    const http = httpLink.create({uri: 'https://us-west-2.api.scaphold.io/graphql/invoice-system'});

    const auth = setContext((_, {headers}) => {
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MTg5MDY5MDEsImlhdCI6MTUxNzYxMDkwMSwiYXVkIjoiNGFlYzQ3YjgtZDk5MS00OTQxLWI3OGUtYTQwMDkyMzZiNTAyIiwiaXNzIjoiaHR0cHM6Ly9zY2FwaG9sZC5pbyIsInN1YiI6IjEifQ.TvFdJeuujynyhSG4CpQqZrKdVlm2wtbDWe4IObFMf0Q';

      if (headers) {
        headers = headers.append('Authorization', `Bearer ${token}`);
      } else {
        headers = new HttpHeaders({Authorization: `Bearer ${token}`});
      }

      return {
        headers: headers
      };
    });

    apollo.create({
      link: auth.concat(http),
      cache: new InMemoryCache()
    });

    const TestQuery = gql`
    query GetUser ($input: ID!) {
      getUser (id: $input) {
        id
        username
        createdAt
        modifiedAt
        lastLogin
      }
    } `;

    apollo.query({
      query: TestQuery,
      variables: {
        input: 'VXNlcjox'
      }
    }).subscribe(console.log);
  }
}
