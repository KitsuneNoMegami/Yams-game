using System;
using System.IO;
using System.Threading;
using Internal;

public struct GameData
{
    public Parameters Parameters;
    public Player[] Players;
    public Round[] Rounds;
    public FinalResult[] FinalResults;
}
public struct Parameters
{
    public string Code;
    public string Date;  // Stocké comme chaîne pour simplifier
}
public struct Player
{
    public int Id;
    public string Pseudo;
}
public struct Round
{
    public int Id;
    public Result[] Results;
}
public struct Result
{
    public int IdPlayer;
    public int[] Dice;
    public string Challenge;
    public int Score;
}
public struct FinalResult
{
    public int IdPlayer;
    public int Bonus;
    public int Score;

    public static string ToString(GameData DATA) {
      string s="";
      s=s + "\"final_result\": [\n";
      for (int p=0; p<2; p++) {
        s=s + "\t{\n";
        s=s + "\t\t\"id_player\": "+DATA.FinalResults[p].IdPlayer+",\n";
        s=s + "\t\t\"bonus\": "+DATA.FinalResults[p].Bonus+",\n";
        s=s + "\t\t\"score\": "+DATA.FinalResults[p].Score+",\n";
        if (p==0) {s=s + "\t},\n";}
        else {s=s + "\t}\n";}
      }
      s=s + "]\n";
      return s;
    }
}


struct Joueur {
  public int num;
  public string nom;
  public int score;
  public int score_min;
  public int score_total;
  public bool[] Challenges;
}


class YAMS {
  public static string Vert(string S) {
    return "\u001b[32m" + S + "\u001b[0m";    //32=vert en code ANSI
  }
  public static string Rouge(string S) {
    return "\u001b[31m" + S + "\u001b[0m";
  }

  public static void Affiche(int[] T, int N) {      //AFFICHE tab de N entiers
    for (int i=0; i<N; i++) {
      Console.Write(Vert(T[i]+" "));
    }
    Console.WriteLine();
  }

  public static bool Present(int[] T, int n) {
    bool pres=false;
    for (int i=0; i<5 && pres==false; i++) {
      if (T[i]==n) {pres=true;}
    }
    return pres;
  }

  public static int[] Trie(int[] T) {     // TRIE tab de 6 entiers
    int min;
    for (int i=0; i<5; i++) {
      min = i;
      for (int j=i; j<5; j++) {
        if (T[j]<T[min]) {
          min=j;
        }
      }
      int tmp = T[i];
      T[i] = T[min];
      T[min] = tmp;
    }
    return T;
  }

    // T DOIT ETRE UN TABLEAU TRIE POUR LES TESTS
  public static int NbDansTab(int[] T, int n) {     // COMPTE le nombre de n dans tab
    int compt = 0;
    for (int i=0; i<5; i++) {
      if (T[i]==n) {compt++;}
    }
    return compt;
  }

  public static int Brelan(int[] T) {     // TESTE un brelan et renvoie le score
    int score = 0;
    for (int i=1; i<7; i++) {
      if (NbDansTab(T,i)>=3) {
        score=i*3;
      }
    }
    return score;
  }
  public static int Carre(int[] T) {      // TESTE un carré et renvoie le score
    int score = 0;
    for (int i=1; i<7; i++) {
      if (NbDansTab(T,i)>=4) {
        score=i*4;
      }
    }
    return score;
  }
  public static int Full(int[] T) {     // TESTE un full et renvoie le score
    int score = 0;
    int n1=T[0];
    int n2=T[4];
    if ((NbDansTab(T,n1)==2 && NbDansTab(T,n2)==3) || (NbDansTab(T,n1)==3 && NbDansTab(T,n2)==2)) {
      score=25;
    }
    return score;
  }
  public static int PetiteSuite(int[] T) {      // TESTE une petite suite et renvoie le score
    int score = 0;
    bool suite=false;
    for (int j=1; j<4 && suite==false; j++) {
      suite = true;
      for (int i=j; i<j+4; i++) {
        if (Present(T,i)==false) {suite=false;}
      }
    }
    if (suite) {score=30;}
    return score;
  }
  public static int GrandeSuite(int[] T) {      // TESTE une grande suite et renvoie le score
    int score = 0;
    bool suite=false;
    for (int j=1; j<3 && suite==false; j++) {
      suite = true;
      for (int i=j; i<j+5; i++) {
        if (Present(T,i)==false) {suite=false;}
      }
    }
    if (suite) {score=40;}
    return score;
  }
  public static int Yams(int[] T) {      // TESTE un yams et renvoie le score
    int score = 0;
    int n=T[0];
    if (NbDansTab(T,n)==5) {score=50;}
    return score;
  }
  public static int Chance(int[] T) {     // TESTE une chance et renvoie le score
    int somme=0;
    for (int i=0; i<5; i++) {
      somme=somme+T[i];
    }
    return somme;
  }

  public static string DejaFait(int ind, Joueur J) {     //teste si le challenge ind est déjà fait
    if (J.Challenges[ind]==true) {
      return Rouge(" (Challenge déjà réalisé)");
    }
    return "";
  }
  public static void AfficheChallenges(Joueur J) {
    Console.WriteLine("Liste des challenges : ");
    for (int i=1; i<=6; i++) {
      Console.WriteLine("["+i+"]"+" Nombre de "+i + " (Somme des dés ayant obtenu "+i + ")"+DejaFait(i-1,J));
    }

    Console.WriteLine("[7] Brelan (Sommes des 3 dés identiques)"+DejaFait(6,J));
    Console.WriteLine("[8] Carré (Sommes des 4 dés identiques)"+DejaFait(7,J));
    Console.WriteLine("[9] Full (3 dés de même valeur + 2 dés de même valeur - 25 pts)"+DejaFait(8,J));
    Console.WriteLine("[10] Petite Suite (Une suite de 4 nombres - 30 pts)"+DejaFait(9,J));
    Console.WriteLine("[11] Grande Suite (Une suite de 5 nombres - 40 pts)"+DejaFait(10,J));
    Console.WriteLine("[12] Yam's (5 dés identique - 50 pts)"+DejaFait(11,J));
    Console.WriteLine("[13] Chance (La somme des dés obtenus)"+DejaFait(12,J));
  }
  public static Joueur ChoixChallenge(Joueur J, int[] T, GameData DATA, int R) {
    int[] Scores = new int[13] {0,0,0,0,0,0,Brelan(T),Carre(T),Full(T),PetiteSuite(T),GrandeSuite(T),Yams(T),Chance(T)};
    string[] challenges = new string[13] {"nombre1","nombre2","nombre3","nombre4","nombre5","nombre6","brelan","carre","full","petite","grande","yams","chance"};

    for (int i=1; i<=6; i++) {
      Scores[i-1] = NbDansTab(T,i)*i;
      Console.WriteLine("["+i+"]"+" Nombre de "+i+" : "+Scores[i-1]+DejaFait(i-1,J));
    }

    Console.WriteLine("[7] Brelan : "+Scores[6]+DejaFait(6,J));
    Console.WriteLine("[8] Carré : "+Scores[7]+DejaFait(7,J));
    Console.WriteLine("[9] Full : "+Scores[8]+DejaFait(8,J));
    Console.WriteLine("[10] Petite Suite : "+Scores[9]+DejaFait(9,J));
    Console.WriteLine("[11] Grande Suite : "+Scores[10]+DejaFait(10,J));
    Console.WriteLine("[12] Yam's : "+Scores[11]+DejaFait(11,J));
    Console.WriteLine("[13] Chance : "+Scores[12]+DejaFait(12,J));

    Console.WriteLine(Vert(J.nom+", faites votre choix de challenge (1-13)"));

    int ch = 0;
    bool valide = false;
    while (valide==false) {
      if (int.TryParse(Console.ReadLine(), out ch) && 0<ch &&ch<=13 && J.Challenges[ch-1] == false) {
        valide=true;
      } else {
        Console.WriteLine(Rouge("Choix incorrect ou challenge déjà réalisé"));
      }
    }

    DATA.Rounds[R-1].Results[J.num-1].Challenge = challenges[ch-1];
    for (int d=0; d<5; d++) {
      DATA.Rounds[R-1].Results[J.num-1].Dice[d] = T[d];
    }
    DATA.Rounds[R-1].Results[J.num-1].Score = Scores[ch-1];
    
    J.Challenges[ch-1] = true;
    if (ch<7) {
      J.score_min=J.score_min+ Scores[ch-1];
    }
    J.score=J.score+ Scores[ch-1];
    
    return J;
  }




  public static int[] RelanceDes(int[] T, bool[] Change) {     //Lance certains dés en fonction de sa correspondance dans Change (si true)
    Random random = new Random();
    for (int i=0; i<5; i++) {
      if (Change[i]) {
        T[i] = random.Next(1,7);
      }
    }
    return Trie(T);
  }

  public static bool[] ChoixRelance() {
    bool[] Change = new bool[5] {false,false,false,false,false};
    Console.WriteLine("Entrez les numéros de dés que vous voulez relancer (1-5) ou tapez <A> pour annuler vos choix. Pour valider votre sélection, appuyez sur n'importe quelle touche. ");
    int c;
    bool fin = false;
    string input;
    while (fin==false) {
      input = Console.ReadLine();
      if (input=="A") {
        for (int i=0;i<5;i++) {Change[i]=false;}
        Console.WriteLine(Rouge("Tous les dés ont été désélectionnés"));
      }
      else if (int.TryParse(input, out c) && 0<c && c<6) {
        Change[c-1] = true;
      } else {
        fin = true;
      }
    }
    return Change;
  }



  public static Joueur[] InitJoueurs() {     // Renvoie un tableau de 2 joueurs
    Joueur[] TabJ = new Joueur[2];
    for (int i=1; i<=2; i++) {
      Console.Write("Joueur {0}, entrez votre nom : ",i);

      Joueur J = new Joueur();
      J.num = i;
      J.nom = Console.ReadLine();
      J.score = 0;
      J.score_min = 0;
      J.score_total = 0;
      J.Challenges = new bool[13] {false,false,false,false,false,false,false,false,false,false,false,false,false};
      TabJ[i-1] = J;
    }
    Console.WriteLine("\n");
    return TabJ;
  }


  public static Joueur Tour(Joueur J, GameData DATA, int R) {
    Console.WriteLine(Vert(J.nom+", c'est votre tour !"));
    bool[] Change = new bool[5] {true,true,true,true,true};
    int[] T = new int[5];

    AfficheChallenges(J);
    for (int i=1;i<4;i++) {
      if (i>1) { 
        Change = ChoixRelance();
        bool valider = true;
        for (int b=0; b<5; b++) {
          if (Change[b] == true) {valider=false;}
        }
      if (valider == true) {break;}     
      }
      Console.WriteLine(Rouge("Lancer n°"+i+" :"));
      T = RelanceDes(T,Change);
      Affiche(T,5);
    }

    J = ChoixChallenge(J,T,DATA,R);
    Console.WriteLine("Score total de "+J.nom+" : "+J.score);
    Console.WriteLine("\n");
    Thread.Sleep(2000);
    return J;
  }
  
  public static Joueur[] ResultatFin(Joueur[] TabJ, GameData DATA) {
      Console.WriteLine(Rouge(" --- PARTIE TERMINEE --- "));
      for (int j = 0; j < 2; j++) {
        TabJ[j].score_total = TabJ[j].score;
        if (TabJ[j].score_min >= 63) {
            TabJ[j].score_total += 35;
            Console.WriteLine("Joueur " + TabJ[j].num + " " + TabJ[j].nom + " : " + TabJ[j].score + Vert(" + 35") + " = " + TabJ[j].score_total);
            DATA.FinalResults[j].Bonus = 35;
        } else {
            Console.WriteLine("Joueur " + TabJ[j].num + " " + TabJ[j].nom + " : " + TabJ[j].score_total);
        }

        DATA.FinalResults[j].Score = TabJ[j].score_total;
      }
      Console.WriteLine();

      if (TabJ[0].score_total > TabJ[1].score_total) {
          Console.WriteLine(Vert("Bravo " + TabJ[0].nom + " !"));
      } else if (TabJ[0].score_total < TabJ[1].score_total) {
          Console.WriteLine(Vert("Bravo " + TabJ[1].nom + " !"));
      } else {
          Console.WriteLine(Vert("Match nul !"));
      }

      return TabJ;
  }





  public static GameData InitGameData(Joueur[] TabJ) {
    GameData DATA = new GameData();
    DATA.Parameters = new Parameters();
    DATA.Parameters.Code = "99999";
    DATA.Parameters.Date = DateTime.Now.ToString("yyyy-MM-dd");
    DATA.Players = new Player[2];
    for (int p=0; p<2; p++) {
      DATA.Players[p] = new Player();
      DATA.Players[p].Id = p;
      DATA.Players[p].Pseudo = TabJ[p].nom;
    }
    DATA.Rounds = new Round[13];
    for (int r=0; r<13; r++) {
      DATA.Rounds[r] = new Round();
      DATA.Rounds[r].Id = r+1;
      DATA.Rounds[r].Results = new Result[2];
      for (int p=0; p<2; p++) {
        DATA.Rounds[r].Results[p] = new Result();
        DATA.Rounds[r].Results[p].IdPlayer = p;
        DATA.Rounds[r].Results[p].Dice = new int[5];
        DATA.Rounds[r].Results[p].Challenge = "";
        DATA.Rounds[r].Results[p].Score = 0;
      }
    }
    DATA.FinalResults = new FinalResult[2];
    for (int p=0; p<2; p++) {
      DATA.FinalResults[p].IdPlayer=p;
      DATA.FinalResults[p].Bonus = 0;
      DATA.FinalResults[p].Score = 0;
    }
    
    return DATA;
  }


  public static void CreationJson(GameData DATA) {
      StreamWriter F = new StreamWriter("data/gamedata.json");

      F.WriteLine("{");

      // Write Parameters section
      F.WriteLine("\t\"parameters\": {");
      F.WriteLine("\t\t\"code\": \"" + DATA.Parameters.Code + "\",");
      F.WriteLine("\t\t\"date\": \"" + DATA.Parameters.Date + "\"");
      F.WriteLine("\t},");

      // Write Players section
      F.WriteLine("\t\"players\": [");
      for (int i = 0; i < DATA.Players.Length; i++) {
          F.WriteLine("\t\t{");
          F.WriteLine("\t\t\t\"id\": " + DATA.Players[i].Id + ",");
          F.WriteLine("\t\t\t\"pseudo\": \"" + DATA.Players[i].Pseudo + "\"");
          if (i == DATA.Players.Length - 1) {
              F.WriteLine("\t\t}");
          } else {
              F.WriteLine("\t\t},");
          }
      }
      F.WriteLine("\t],");

      // Write Rounds section
      F.WriteLine("\t\"rounds\": [");
      for (int r = 0; r < DATA.Rounds.Length; r++) {
          F.WriteLine("\t\t{");
          F.WriteLine("\t\t\t\"id\": " + DATA.Rounds[r].Id + ",");
          F.WriteLine("\t\t\t\"results\": [");
          for (int p = 0; p < DATA.Rounds[r].Results.Length; p++) {
              F.WriteLine("\t\t\t\t{");
              F.WriteLine("\t\t\t\t\t\"id_player\": " + DATA.Rounds[r].Results[p].IdPlayer + ",");
              F.WriteLine("\t\t\t\t\t\"dice\": [" + string.Join(",", DATA.Rounds[r].Results[p].Dice) + "],");
              F.WriteLine("\t\t\t\t\t\"challenge\": \"" + DATA.Rounds[r].Results[p].Challenge + "\",");
              F.WriteLine("\t\t\t\t\t\"score\": " + DATA.Rounds[r].Results[p].Score);
              if (p == DATA.Rounds[r].Results.Length - 1) {
                  F.WriteLine("\t\t\t\t}");
              } else {
                  F.WriteLine("\t\t\t\t},");
              }
          }
          F.WriteLine("\t\t\t]");
          if (r == DATA.Rounds.Length - 1) {
              F.WriteLine("\t\t}");
          } else {
              F.WriteLine("\t\t},");
          }
      }
      F.WriteLine("\t],");

      // Write FinalResults section
      F.WriteLine("\t\"final_result\": [");
      for (int p = 0; p < DATA.FinalResults.Length; p++) {
          F.WriteLine("\t\t{");
          F.WriteLine("\t\t\t\"id_player\": " + DATA.FinalResults[p].IdPlayer + ",");
          F.WriteLine("\t\t\t\"bonus\": " + DATA.FinalResults[p].Bonus + ",");
          F.WriteLine("\t\t\t\"score\": " + DATA.FinalResults[p].Score);
          if (p == DATA.FinalResults.Length - 1) {
              F.WriteLine("\t\t}");
          } else {
              F.WriteLine("\t\t},");
          }
      }
      F.WriteLine("\t]");

      F.WriteLine("}");

      F.Close();
  }



public static void Main() {
    Joueur[] TabJ = InitJoueurs();  // Initialize players
    Console.Clear();

    GameData DATA = InitGameData(TabJ);  // Initialize game data
  
    // Loop through the 13 rounds of the game
    for (int R = 1; R <= 13; R++) {
        Console.WriteLine(Rouge("\t ROUND " + R));  // Print the current round
        for (int j = 0; j < 2; j++) {
            TabJ[j] = Tour(TabJ[j], DATA, R);  // Execute player's turn for the round
            Console.Clear();
        }
        Console.Clear();
    }

    // Final results after all rounds
    TabJ = ResultatFin(TabJ, DATA);  

    // Print the result of the last player's dice in the final round
    Console.WriteLine(DATA.Rounds[12].Results[1].Dice[0]);

    // Now, create the JSON file from the game data
    CreationJson(DATA);  // Call the function to create the JSON file

    Console.WriteLine("Game data saved to 'gamedata.json'.");  // Optional confirmation message
}

}