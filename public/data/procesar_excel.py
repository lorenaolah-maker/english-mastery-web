import os
import json
import pandas as pd

def procesar():
    print("⏳ Leyendo archivos Excel...")
    archivo_verbos = "verbos_ingles_conjugados_completo.xlsx"
    archivo_vocab = "vocabulario_ingles.xlsx"
    
    user_home = os.path.expanduser("~")
    if not os.path.exists(archivo_verbos):
        archivo_verbos = os.path.join(user_home, "Downloads", "verbos_ingles_conjugados_completo.xlsx")
    if not os.path.exists(archivo_vocab):
        archivo_vocab = os.path.join(user_home, "Downloads", "vocabulario_ingles.xlsx")
        
    df_verbs = pd.read_excel(archivo_verbos)
    df_vocab = pd.read_excel(archivo_vocab, sheet_name="Vocabulario")
    
    verbs_clean = []
    for idx, r in df_verbs.iterrows():
        day_num = int(r["Día"]) if pd.notnull(r["Día"]) else (idx // 3) + 1
        verbs_clean.append({
            "id": idx + 1,
            "day": day_num,
            "base": str(r["Verbo_Base"]).strip(),
            "es": str(r["Significado"]).strip(),
            "type": str(r["Tipo"]).strip() if pd.notnull(r["Tipo"]) else "Regular",
            "pron": str(r["Pronunciacion_Español"]).strip() if pd.notnull(r["Pronunciacion_Español"]) else "",
            "past": str(r["Pasado_Forma"]).strip() if pd.notnull(r["Pasado_Forma"]) else str(r["Pas_I"]).replace("I ", ""),
            "participle": str(r["Participio"]).strip() if pd.notnull(r["Participio"]) else "",
            "pres_i": str(r.get("Pres_I", "")).strip(),
            "pres_you": str(r.get("Pres_You", "")).strip(),
            "pres_he": str(r.get("Pres_He_She_It", "")).strip(),
            "pres_we": str(r.get("Pres_We", "")).strip(),
            "pres_they": str(r.get("Pres_They", "")).strip(),
            "pas_i": str(r.get("Pas_I", "")).strip(),
            "pas_you": str(r.get("Pas_You", "")).strip(),
            "pas_he": str(r.get("Pas_He_She_It", "")).strip(),
            "pas_we": str(r.get("Pas_We", "")).strip(),
            "pas_they": str(r.get("Pas_They", "")).strip(),
            "will": str(r.get("Fut_Will_I", "")).strip(),
            "will_he": str(r.get("Fut_Will_He_She_It", "")).strip(),
            "will_they": str(r.get("Fut_Will_They", "")).strip(),
            "going": str(r.get("Fut_Going_I", "")).strip(),
            "going_he": str(r.get("Fut_Going_He_She_It", "")).strip(),
            "going_they": str(r.get("Fut_Going_You_We_They", "")).strip(),
            "exPres": str(r.get("Ejemplo_Presente", "")).strip(),
            "exPast": str(r.get("Ejemplo_Pasado", "")).strip(),
            "exFut": str(r.get("Ejemplo_Futuro", "")).strip()
        })

    words_clean = []
    for idx, r in df_vocab.iterrows():
        day_num = (idx // 7) + 1
        words_clean.append({
            "id": idx + 1,
            "day": day_num,
            "word": str(r["Palabra"]).strip(),
            "ipa": str(r["IPA"]).strip() if pd.notnull(r["IPA"]) else "",
            "pron": str(r["Pron. (español)"]).strip() if pd.notnull(r["Pron. (español)"]) else "",
            "cat": str(r["Categoría"]).strip() if pd.notnull(r["Categoría"]) else "",
            "es": str(r["Significado"]).strip() if pd.notnull(r["Significado"]) else "",
            "theme": str(r["Tema"]).strip() if pd.notnull(r["Tema"]) else ""
        })

    os.makedirs("public/data", exist_ok=True)
    with open("public/data/verbs.json", "w", encoding="utf-8") as f:
        json.dump(verbs_clean, f, ensure_ascii=False)
    with open("public/data/words.json", "w", encoding="utf-8") as f:
        json.dump(words_clean, f, ensure_ascii=False)
    print("✅ ¡Archivos generados en public/data/verbs.json y public/data/words.json con éxito!")

if __name__ == "__main__":
    procesar()