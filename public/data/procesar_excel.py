import os
import json
import pandas as pd

def procesar():
    print("⏳ Leyendo archivos Excel...")
    
    # Rutas esperadas (asegurate de tener los archivos .xlsx en la carpeta del proyecto o en Descargas)
    archivo_verbos = "verbos_ingles_conjugados_completo.xlsx"
    archivo_vocab = "vocabulario_ingles.xlsx"
    
    # Si estan en Descargas, intentar buscarlos ahi tambien
    user_home = os.path.expanduser("~")
    if not os.path.exists(archivo_verbos):
        archivo_verbos = os.path.join(user_home, "Downloads", "verbos_ingles_conjugados_completo.xlsx")
    if not os.path.exists(archivo_vocab):
        archivo_vocab = os.path.join(user_home, "Downloads", "vocabulario_ingles.xlsx")
        
    df_verbs = pd.read_excel(archivo_verbos)
    df_vocab = pd.read_excel(archivo_vocab, sheet_name="Vocabulario")
    
    print(f"📊 Verbos encontrados: {len(df_verbs)} | Palabras encontradas: {len(df_vocab)}")
    
    # 1. Limpiar y estructurar 2,151 verbos (3 por dia)
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
            "will": str(r["Fut_Will_I"]).strip() if pd.notnull(r["Fut_Will_I"]) else f"I will {r['Verbo_Base']}",
            "going": str(r["Fut_Going_I"]).strip() if pd.notnull(r["Fut_Going_I"]) else f"I am going to {r['Verbo_Base']}",
            "exPres": str(r["Ejemplo_Presente"]).strip() if pd.notnull(r["Ejemplo_Presente"]) else "",
            "exPast": str(r["Ejemplo_Pasado"]).strip() if pd.notnull(r["Ejemplo_Pasado"]) else "",
            "exFut": str(r["Ejemplo_Futuro"]).strip() if pd.notnull(r["Ejemplo_Futuro"]) else ""
        })

    # 2. Limpiar y estructurar 4,960 palabras (7 por dia)
    words_clean = []
    for idx, r in df_vocab.iterrows():
        day_num = (idx // 7) + 1  # 7 palabras diarias
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