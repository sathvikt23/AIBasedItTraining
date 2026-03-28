#Text summariazation by Ps G88
"""
modules used 
spacy //pip install spacy
youtube_transcript_api //pip install youtube-transcript-api
google.generativeai  //pip install google-generativeai

if anyone is using conda , intall it according to its requirements 
"""
import urllib.request
import spacy 
import re 
from spacy .lang.en.stop_words import STOP_WORDS
from string import punctuation
from heapq import nlargest
from youtube_transcript_api import YouTubeTranscriptApi as yta 

from all_in_one.LLMservice import GeminiClient

client = GeminiClient.get_instance()

class youtube():
        
               
        def transcribe(self, link):#Here pass the link only , copy it from the url 
                ids=link.split("=")
                vid_id=ids[1]
                print(vid_id)
                data=yta().fetch(video_id=vid_id)
                transcript=''
                for snippet in data:
                    transcript+=snippet.text
                

                return {"video_id":vid_id,"transcript":transcript}
       
       
        def video_recomendations(self,data):
            query1=client.get_response("Give me the main topic of this even though there less is context , do not reply asking more information "+data)
            temp=query1.split(" ")
            query1="+".join(temp)
            query1=query1.replace("\n","")
            print(query1)
            html = urllib.request.urlopen(f"https://www.youtube.com/results?search_query={query1}+for+education+in+english")  
          
            #print(html.read().decode())
            video_ids=re.findall(r"watch\?v(\S{12})",html.read().decode())  
            search1=list(set(video_ids[0:10]))
            query=client.get_response("List all the topics in this data "+data)
            #print(query1+query)
            query=query1+query
            temp=query.split(" ")
            query="+".join(temp)
            query=query.replace("\n","")
            html = urllib.request.urlopen(f"https://www.youtube.com/results?search_query=for+education+{query}&sp=CAI%253D")  
            #print(html.read().decode())
            video_ids=re.findall(r"watch\?v(\S{12})",html.read().decode())  
            search2=list(set(video_ids[0:4])) 
            return list(set(search1+search2))
        

