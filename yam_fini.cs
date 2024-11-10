using System;
using System.Threading;
using Internal;


struct Joueur {
  public int num;
  public string nom;
  public int score;
  public int score_min;
  public int score_total;
  public bool[] Challenges;
};


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
      Console.WriteLine("["+i+"]"+"Nombre de "+i+DejaFait(i-1,J));
    }

    Console.WriteLine("[7] Brelan"+DejaFait(6,J));
    Console.WriteLine("[8] Carré"+DejaFait(7,J));
    Console.WriteLine("[9] Full"+DejaFait(8,J));
    Console.WriteLine("[10] Petite Suite"+DejaFait(9,J));
    Console.WriteLine("[11] Grande Suite"+DejaFait(10,J));
    Console.WriteLine("[12] Yam's"+DejaFait(11,J));
    Console.WriteLine("[13] Chance"+DejaFait(12,J));
  }
  public static Joueur ChoixChallenge(Joueur J, int[] T) {
    int[] Scores = new int[13] {0,0,0,0,0,0,Brelan(T),Carre(T),Full(T),PetiteSuite(T),GrandeSuite(T),Yams(T),Chance(T)};
    for (int i=1; i<=6; i++) {
      Scores[i-1] = NbDansTab(T,i)*i;
      Console.WriteLine("["+i+"]"+"Nombre de "+i+" : "+Scores[i-1]+DejaFait(i-1,J));
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
    Console.WriteLine("Entrez les numéros de dés que vous voulez relancer (1-5), <A> pour annuler les choix, ou autre pour valider");
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


  public static Joueur Tour(Joueur J) {
    Console.WriteLine(Vert(J.nom+", c'est votre tour !"));
    bool[] Change = new bool[5] {true,true,true,true,true};
    int[] T = new int[5];

    AfficheChallenges(J);
    for (int i=1;i<4;i++) {
      if (i>1) { 
        Change = ChoixRelance();
      }
      Console.WriteLine(Rouge("Lancer n°"+i+" :"));
      T = RelanceDes(T,Change);
      Affiche(T,5);
    }

    J = ChoixChallenge(J,T);
    Console.WriteLine("Score total de "+J.nom+" : "+J.score);
    Console.WriteLine("\n");
    Thread.Sleep(2000);
    return J;
  }
  
  public static Joueur[] ResultatFin(Joueur[] TabJ) {
    Console.WriteLine(Rouge(" --- PARTIE TERMINEE --- "));
    for (int j=0; j<2; j++) {
      Joueur J = TabJ[j];
      J.score_total=J.score;
      if (J.score_min>=63) {
        J.score_total=J.score_total+35;
        Console.WriteLine("Joueur "+J.num+" "+J.nom+" : "+J.score+Vert(" + 35")+" = "+J.score_total);
      } else {
        Console.WriteLine("Joueur "+J.num+" "+J.nom+" : "+J.score_total);
      }
    }
    Console.WriteLine();

    if (TabJ[0].score_total > TabJ[1].score_total) {
      Console.WriteLine(Vert("Bravo "+TabJ[0].nom+ " !"));
    } else {
      Console.WriteLine(Vert("Bravo "+TabJ[1].nom+ " !"));
    }

    return TabJ;
  }




  public static void Main() {
    Joueur[] TabJ = InitJoueurs();
    Console.Clear();
    
    for (int R=1; R<=13; R++) {
      Console.WriteLine(Rouge("\t ROUND "+R));
      for (int j=0; j<2; j++) {
        TabJ[j] = Tour(TabJ[j]);
        Console.Clear();
      }
      Console.Clear();
    }

    TabJ = ResultatFin(TabJ);
  }
}