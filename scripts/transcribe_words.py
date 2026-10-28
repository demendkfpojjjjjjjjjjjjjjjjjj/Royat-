# Word-level Arabic transcription (faster-whisper). Usage:
#   for i in 01 02 03 04; do ffmpeg -i assets/source-$i.mp4 -ac 1 -ar 16000 analysis/audio-$i.wav; done
#   python3 scripts/transcribe_words.py <path-to-whisper-ct2-model>
import json,sys,wave,numpy as np
from faster_whisper import WhisperModel
m=WhisperModel(sys.argv[1],device="cpu",compute_type="int8",cpu_threads=4)
P="الهاكر عشان يخترقك ما يحتاج. أمن سيبراني. نوافذ منبثقة، تحويلات، HTTPS والقفل، مشكلة قانونية، مشكلة تقنية، صلاحيات الإدارة، لوحة الإدارة، ثغرة مفتوحة."
out={}
for i in ["01","02","03","04"]:
    wf=wave.open(f"analysis/audio-{i}.wav"); a=np.frombuffer(wf.readframes(wf.getnframes()),np.int16).astype(np.float32)/32768
    segs,_=m.transcribe(a,language="ar",beam_size=8,word_timestamps=True,initial_prompt=P,condition_on_previous_text=False)
    W=[]
    for s in segs:
        for w in s.words: W.append({"w":w.word.strip(),"s":round(w.start,2),"e":round(w.end,2),"p":round(w.probability,2)})
    out[i]=W
    print(i," ".join(f"{x['w']}[{x['s']}-{x['e']}|{x['p']}]" for x in W),flush=True)
json.dump(out,open("analysis/whisper-words.json","w"),ensure_ascii=False,indent=0)
