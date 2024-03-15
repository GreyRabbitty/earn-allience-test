import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { API_KEY } from '../config/apiKey';

@Injectable()
export class GameTwitterApiService {
  private readonly logger = new Logger(GameTwitterApiService.name);
  private readonly siteUrl: string;
  constructor(private readonly configService: ConfigService) {
    this.siteUrl = this.configService.get('media.siteUrl');
  }

  async getFollowerAccounts(
    id: string,
  ) {

    try {
      return await this.getFollowerAccountHandler(id);
    } catch (e) {
      console.log(e);
      return 'error'
    }
  }

  async getFollowerAccountHandler(id: string): Promise<any> {
    const options = {
      method: 'GET',
      url: 'https://twitter154.p.rapidapi.com/user/followers',
      params: {
        user_id: id,
        limit: '100'
      },
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'twitter154.p.rapidapi.com'
      }
    };
    
    try {
      const response = await axios.request(options);
      console.log(response.data);
      return response.data
    } catch (error) {
      console.error(error);
      return error;
    }
  }

  async getFollowerCount(id: string): Promise<any> {
    const axios = require('axios');

    const options = {
      method: 'GET',
      url: 'https://twitter135.p.rapidapi.com/v1.1/Users/',
      params: { ids: id },
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'twitter135.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      return response.data[0].followers_count
    } catch (error) {
      console.error(error);
    }
  }

  async getUserDate(id: string): Promise<any> {
    const axios = require('axios');

    const options = {
      method: 'GET',
      url: 'https://twitter135.p.rapidapi.com/v1.1/Users/',
      params: { ids: id },
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'twitter135.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  async fetchFollowersListByGameId(id: string): Promise<any> {
    const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));

    // Get the follower count
    const count = await this.getFollowerCount(id);
    console.log('count ==> ', count)
    await delay(1500);

    let flag = false;
    let followerIdList = [];
    let nextCurse = '';

    // get the followerIdList
    while (flag == false) {
      await delay(500);

      const options = nextCurse == '' ?
        {
          method: 'GET',
          url: 'https://twitter135.p.rapidapi.com/v1.1/FollowersIds/',
          params: {
            id: id,
            count: '5000'
          },
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'twitter135.p.rapidapi.com'
          }
        }
        :
        {
          method: 'GET',
          url: 'https://twitter135.p.rapidapi.com/v1.1/FollowersIds/',
          params: {
            id: id,
            count: '5000',
            cursor: nextCurse
          },
          headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'twitter135.p.rapidapi.com'
          }
        };

      const response = await axios.request(options);

      followerIdList = followerIdList.concat(response.data.ids);
      nextCurse = response.data.next_cursor_str;

      if (nextCurse == "0") flag = true;
    }

    return followerIdList;

  }
  
}
