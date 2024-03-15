import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { parseString } from 'xml2js';

import { RssFeedMedia } from '../activities';

@Injectable()
export class MediaApisService {
  private readonly logger = new Logger(MediaApisService.name);
  private readonly siteUrl: string;
  constructor(private readonly configService: ConfigService) {
    this.siteUrl = this.configService.get('media.siteUrl');
  }

  async getRssFeedData(feedUrl: string): Promise<RssFeedMedia[]> {
    try {
      const response = await axios.get(feedUrl);
      const data = response.data;
      /// Process the data here...
      const parsedData = await this.parseXml(data);
      const items = parsedData.rss.channel[0].item;
      const formattedData = items.map((item) => ({
        title: item.title[0],
        url: item.link[0],
        postedAt: item.pubDate[0],
        content: item['content:encoded'][0] || '',
      }));
      return formattedData;
    } catch (error) {
      this.logger.error('Failed to retrieve data', error);
      return;
    }
  }

  private parseXml(xmlData: string): Promise<any> {
    return new Promise((resolve, reject) => {
      parseString(xmlData, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  async extractDescription(item: any): Promise<string> {
    const contentElement = item;

    if (!contentElement) {
      return '';
    }

    const paragraphRegex = /<p\b[^>]*>([\s\S]*?)<\/p>/;
    const paragraphMatch = contentElement.match(paragraphRegex);

    if (paragraphMatch) {
      const paragraphContent = paragraphMatch[1];
      const plainText = paragraphContent.replace(/<[^>]+>/g, '');
      const trimmedContent = plainText.trim();
      return trimmedContent;
    }

    return '';
  }

  async extractIdFromLink(urlString: any): Promise<string> {
    try {
      const url = new URL(urlString);
      const pathSegments = url.pathname.split('/');
      const data = pathSegments[2];
      return data;
    } catch (error) {
      return null;
    }
  }
}
